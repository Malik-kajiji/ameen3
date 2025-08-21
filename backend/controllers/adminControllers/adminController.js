const Admin = require('../../models/admin');
const JWT = require('jsonwebtoken');

const loginAsAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.loginAsAdmin(username, password);
        const token = JWT.sign({ _id: admin._id }, process.env.SECRET);
        res.status(200).json({ 
            username: admin.username,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            access: admin.access,
            token 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.getAllAdmins();
        res.status(200).json(admins);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { username, password, name, email, role, access } = req.body;
        const admin = await Admin.createAdmin(username, password, name, email, role, access);
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { access, status } = req.body;
        
        if (access) {
            const admin = await Admin.editAccess(id, access);
            res.status(200).json(admin);
        } else if (status) {
            const admin = await Admin.findByIdAndUpdate(
                id, 
                { status }, 
                { new: true }
            );
            res.status(200).json(admin);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.deleteAdmin(id);
        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    loginAsAdmin,
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin
};