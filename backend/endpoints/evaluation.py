"""
author: topr
last updated: 25.05.2021
currently used: yes
description: used to calculate recycling value
"""

from flask_restful import Resource, request
import pandas as pd
import numpy as np
import json
from dbfunctions.connect import connect_db
from itertools import product


class Evaluation(Resource):

    def post(self):

        db_connection = connect_db()

        g = 0.2  # ERKLAERUNG NOTWENDIG - Oberfläche?#
        h = 0.5  # ERKLAERUNG NOTWENDIG - Oberfläche?#

        json_data = request.get_json(force=True)

        data = []

        # If material contains dangerous components set f1 to 0.0
        if(int(json_data["isDangerous"]) == 0):
            f1 = 1.0
        else:
            f1 = 0.0

        # Iterates through every row in table tree
        for element in json_data["dataBackend"]:

            data.append([element["result_id"], element["parent_id"], element["mat_id"], element["mat_desc"], element["plast_fam"],
                         element["mara_plast_id"], element["weight"], element["is_atomic"]])

        # Create df out of list data
        table_tree = pd.DataFrame(data, columns=[
            "result_id", "parent_id", "mat_id", "mat_desc", "plast_fam", "mara_plast_id", "weight", "is_atomic"])

        # Filter to get only atomic components
        temp = table_tree.loc[table_tree["is_atomic"] == 1]

        # Read in necessary data from data base and merge data frames
        compability = pd.read_sql_query(
            'SELECT * FROM compability', db_connection)
        rel = pd.read_sql_query('SELECT * FROM rel', db_connection)
        sys_sort = pd.read_sql_query('SELECT * FROM sys_sort', db_connection)
        merged = temp.merge(sys_sort, left_on='plast_fam', right_on='Eintrag')

        # Call functions to calculate different metricss
        f2 = calculate_f2(temp)
        f3 = calculate_f3(temp, rel, table_tree)
        f4 = calculate_f4(temp, compability)
        rv = f1 * f2 * f3 * f4

        # rv cant be greater than 1.0 or smaller than 0.0
        if(rv > 1.0):
            rv = 1.0
        elif(rv < 0.0):
            rv = 0.0

        # Get grade (A-F) based on rv
        grade = get_grade(rv)

        # Prepare return json
        evaluation = dict()
        evaluation["mat_id"] = data[0][2]
        evaluation["mat_desc"] = data[0][3]
        evaluation["GWP"] = round(
            np.dot(merged["weight"], merged["GWP"])/1000, 2)
        evaluation["ADPf"] = round(
            np.dot(merged["weight"], merged["ADPf"])/1000, 2)
        evaluation["Price"] = round(
            np.dot(merged["weight"], merged["Preis"])/1000, 2)
        evaluation["RV"] = round(rv, 2)
        evaluation["Grade"] = grade

        # Print results in console
        print(f"f1: {f1}")
        print(f"f2: {f2}")
        print(f"f3: {f3}")
        print(f"f4: {f4}")
        print(evaluation)

        return evaluation


def calculate_f2(temp):
    '''
    Calculates f2 score which indicates a materials system ability.

    Args:
    - temp: dataframe that contains information about a material, its material family and its weight

    Returns:
    - temp: sys_ab added to original dataframe
    - f2: f2 score
    '''

    # Call function has system ability and apply to every material
    temp["sys_ab"] = temp["mara_plast_id"].apply(get_has_system_ability)

    f2 = temp.loc[temp["sys_ab"] == 2]["weight"].sum()/temp["weight"].sum()

    return f2


def calculate_f3(temp, rel, table_tree):
    '''
    Returns a value based on the sortability of a product.

    Args:
    - temp: dataframe that contains information about a material, its material family and its weight

    Returns:
    - Float between 0.0 and 1.0 for sortability

    '''
    # Get unique families
    n_families = len(set(temp["plast_fam"]))

    # # Call function has sortability and apply to every material
    temp["sort"] = temp["mara_plast_id"].apply(get_can_be_sorted)

    # Calculate sortable percentage
    sortable_percentage = np.dot(
        temp["weight"], temp["sort"])/sum(temp["weight"])

    # Get unique parents for level
    unique_parents = list(set(temp["parent_id"]))

    # Get all relations
    relations = []

    for p in unique_parents:
        parent_mat_id = table_tree.loc[table_tree["result_id"]
                                       == p]["mat_id"].values[0]

        rel_temp = rel.loc[rel["p_id"] == parent_mat_id]["rel_type"].tolist()

        for r in rel_temp:
            relations.append(r)

    print(f"n_families: {n_families}")
    print(f"sortable_percentage: {sortable_percentage}")
    print(f"relations: {relations}")

    # If component only contains parts from one family
    if(n_families == 1):
        return 1.0

    # If component contains parts from more than on family
    # If all relations are detachable
    elif((3 not in relations) & (4 not in relations)):
        if(n_families == 2):
            return 0.95
        else:
            return 0.9

    # If not all relations are detachable
    elif(sortable_percentage > 0.9):
        if(n_families == 2):
            return 0.85
        elif(n_families == 3):
            return 0.8
        else:
            return 0.6
    else:
        return 0.0


def calculate_f4(temp, compability, g=0.2, h=0.5):
    '''
    Calculates "Materialverträglichkeit".

    Args:
    - temp: Part of TableTree that contains only atomic parts
    - compability: Pair material compabilies
    - g
    - h

    Returns:
    - f4: "Materialverträglichkeit"
    '''

    # Create data frame with material combinations
    mat_combinations = pd.DataFrame(
        list(product(temp['mat_id'], temp['mat_id'])), columns=["mat_id_1", "mat_id_2"])

    # Create data frame with individual weights material combinations
    mat_weights = pd.DataFrame(
        list(product(temp['weight'], temp['weight'])), columns=["weight_1", "weight_2"])

    # Create data frame with families of material combinations
    mat_fams = pd.DataFrame(
        list(product(temp['plast_fam'], temp['plast_fam'])), columns=["fam_1", "fam_2"])

    # Merge data frames
    mat_combinations = pd.concat(
        [mat_combinations, mat_weights, mat_fams], axis=1)

    # Calculate mass products
    mat_combinations["mass_product"] = np.multiply(np.array(
        mat_combinations["weight_1"]), np.array(mat_combinations["weight_2"])).tolist()

    # Create empty columns compability
    mat_combinations["compability"] = None

    # Iterte thorough every row
    for i in range(mat_combinations.shape[0]):
        m1_plast_fam = mat_combinations["fam_1"][i]
        m2_plast_fam = mat_combinations["fam_2"][i]

        # Get compabilities
        # If material 1 is the same family as material 2, compability = 1
        if(m1_plast_fam == m2_plast_fam):
            mat_combinations["compability"][i] = 1

        # If not, get values from compability data frame
        elif(len(compability.loc[((compability["Komponente 1"] == m1_plast_fam) & (compability["Komponente 2"] == m2_plast_fam)) | ((compability["Komponente 2"] == m1_plast_fam) & (compability["Komponente 1"] == m2_plast_fam))]["Verträglichkeitswerte neu2"]) != 0):
            comp_value = compability.loc[((compability["Komponente 1"] == m1_plast_fam) & (compability["Komponente 2"] == m2_plast_fam)) | (
                (compability["Komponente 2"] == m1_plast_fam) & (compability["Komponente 1"] == m2_plast_fam))]["Verträglichkeitswerte neu2"].values[0]
            mat_combinations["compability"][i] = float(
                comp_value.replace(',', '.'))

        # If there is no information about compability = 0
        else:
            mat_combinations["compability"][i] = 0

    # Get weighted compability
    mat_combinations["compability_weighted"] = mat_combinations["mass_product"] * \
        mat_combinations["compability"]

    print(mat_combinations)

    # Sum mass products
    mm = sum(mat_combinations["mass_product"])

    print(f"mm: {mm}")

    # Sum up weighted compabilities and divide by summed mass products
    vm = sum(mat_combinations["compability_weighted"])/mm

    print(f"vm: {vm}")

    f4 = 1+g*(vm-h)

    return f4


def get_has_system_ability(mara_plast_id):
    '''
    Gets system ability based on mara_plast_id.

    Args:
    - mara_plast_id: ID in plast table

    Returns:
    - sys_ab: Information on system ability
    '''
    # Get sys_sort and plast from db
    db_connection = connect_db()
    sys_sort = pd.read_sql_query('SELECT * FROM sys_sort', db_connection)
    plast = pd.read_sql_query('SELECT * FROM plast', db_connection)

    try:
        fam = plast.loc[plast["id"] == float(
            mara_plast_id)]["campus_fam"].values[0]

        # Get system ability from sys_sort
        sys_ab = sys_sort.loc[sys_sort["Eintrag"] ==
                              fam]["Systemfaehig (0 - nein, 1 - potentiell, 2 - ja)"].values[0]
        print(f"{mara_plast_id} successful.")

    except:

        # If error occurs, set sys_ab = 0
        sys_ab = 0
        print(f"No entry for material {mara_plast_id} found.")

    return sys_ab


def get_can_be_sorted(mara_plast_id):
    '''
    Gets sorting ability based on mara_plast_id.

    Args:
    - mara_plast_id: ID in plast table

    Returns:
    - sort_ab: Information on the sorting ability 
    '''
    # Get sys_sort and plast from db
    db_connection = connect_db()
    sys_sort = pd.read_sql_query('SELECT * FROM sys_sort', db_connection)
    plast = pd.read_sql_query('SELECT * FROM plast', db_connection)

    # Get sortability from sys_sort
    try:
        fam = plast.loc[plast["id"] == float(
            mara_plast_id)]["campus_fam"].values[0]
        sort_ab = sys_sort.loc[sys_sort["Eintrag"] ==
                               fam]["Sortierbar (0 - nein, 1 - ja)"].values[0]
        print(f"{mara_plast_id} successful.")
    except:
        # If error occurs, set sort_ab = 0
        sort_ab = 0
        print(f"No entry for material {mara_plast_id} found.")

    return sort_ab

# Get recycling grade, based on recycling value


def get_grade(rv):
    if(rv > 0.95):
        return "A"
    elif(rv > 0.85):
        return "B"
    elif(rv > 0.7):
        return "C"
    elif (rv > 0.5):
        return "D"
    elif (rv > 0.3):
        return "E"
    else:
        return "F"
