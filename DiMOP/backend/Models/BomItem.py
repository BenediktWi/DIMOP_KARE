from dbfunctions.connect import db
from sqlalchemy import text


class BomItemModel(db.Model):
    __tablename__ = 'stpo'

    id = db.Column(db.Integer, primary_key=True)
    mast_id = db.Column(db.Integer)
    mara_id = db.Column(db.Integer)
    pos = db.Column(db.Integer)
    height_erp = db.Column(db.Float)
    width_erp = db.Column(db.Float)
    depth_erp = db.Column(db.Float)
    unit_erp = db.Column(db.String)
    volume_cad = db.Column(db.Float)
    unit_cad = db.Column(db.String)
    weight_ui = db.Column(db.String)
    qr_relevant = db.Column(db.Boolean)

    def __init__(self, mast_id, mara_id, pos, height_erp, width_erp, depth_erp, unit_erp, volume_cad, unit_cad, weight_ui, qr_relevant):
        self.mast_id = mast_id
        self.mara_id = mara_id
        self.pos = pos
        self.height_erp = height_erp
        self.width_erp = width_erp
        self.depth_erp = depth_erp
        self.unit_erp = unit_erp
        self.volume_cad = volume_cad
        self.unit_cad = unit_cad
        self.weight_ui = weight_ui
        self.qr_relevant = qr_relevant

    def json(self):
        return {'id': self.id, 'mara_id': self.mara_id, 'pos': self.pos, 'height_erp': self.height_erp, 'width_erp': self.width_erp, 'depth_erp': self.depth_erp, 'volume_cad': self.volume_cad, 'unit_cad': self.unit_cad, 'weight_ui': self.weight_ui, 'qr_relevant': self.qr_relevant}

    @classmethod
    def find_by_mast_id(cls, mast_id):
        sql = text("SELECT stpo_outdated.id, stpo_outdated.mara_id, mara.mara_nr, mara.mat_desc, stpo_outdated.pos, stpo_outdated.height_erp, stpo_outdated.width_erp, stpo_outdated.depth_erp, stpo_outdated.unit_erp, stpo_outdated.volume_cad, stpo_outdated.unit_cad, stpo_outdated.weight_ui, stpo_outdated.qr_relevant FROM stpo_outdated LEFT JOIN mara ON stpo_outdated.mara_id=mara.id WHERE stpo_outdated.mast_id=:mast_id")
        result = db.session.execute(sql, params={"mast_id": mast_id})
        return result.fetchall()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
