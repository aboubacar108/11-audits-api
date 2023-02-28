const express = require('express')
const router = express.Router()

const {
  getAllAudits,
  getAudit,
  createAudit,
  updateAudit,
  deleteAudit,
} = require('../controllers/audits')

router.route('/').post(createAudit).get(getAllAudits)
router.route('/:id').get(getAudit).delete(deleteAudit).patch(updateAudit)

module.exports = router
