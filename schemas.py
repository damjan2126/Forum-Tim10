from marshmallow import Schema, fields


class UserRegister(Schema):
    id = fields.Str(dump_only=True)
    firstName = fields.Str(required=True)
    lastName = fields.Str(required=True)
    address = fields.Str(required=True)
    city = fields.Str(required=True)
    country = fields.Str(required=True)
    phoneNumber = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True)


class UpdateUser(Schema):
    id = fields.Str(required=True)
    firstName = fields.Str()
    lastName = fields.Str()
    address = fields.Str()
    city = fields.Str()
    country = fields.Str()
    phoneNumber = fields.Str()
