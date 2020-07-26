const Session = require('../models/Session')
module.exports = {
    async destroy(req, res) {
        const { user_id } = req.params;

        Session.destroy({
            where: {
                user_id
            }
        })

        res.status(200).send();
    }
}