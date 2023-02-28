const getAllAudits = async (req, res) => {
  res.send('get all audits')
}

const getAudit = async (req, res) => {
  res.send('get single audit')
}

const createAudit = async (req, res) => {
  res.json(req.user)
}

const updateAudit = async (req, res) => {
  res.send('update audit')
}

const deleteAudit = async (req, res) => {
  res.send('delete audit')
}

module.exports = {
  getAllAudits,
  getAudit,
  createAudit,
  updateAudit,
  deleteAudit,
}

