const Audit = require('../models/Audit')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllAudits = async (req, res) => {
  const audits = await Audit.find({createdBy:req.user.userId}).sort('createdAt')
  res.status(StatusCodes.OK).json({audits, count:audits.length})
}

const getAudit = async (req, res) => {
  const {
    user: {userId},
    params: {id:auditId},
  } = req

  const audit = await Audit.findOne({
    _id: auditId,
    createdBy: userId,
  })
  if(!audit) {
    throw new NotFoundError(`No audit with id:${auditId} found`)
  }
  res.status(StatusCodes.OK).json({audit})
}

const createAudit = async (req, res) => {
  req.body.createdBy = req.user.userId
  const audit = await Audit.create(req.body)
  res.status(StatusCodes.CREATED).json({audit})
}

const updateAudit = async (req, res) => {
  const {
    body:{auditName,period,year,type},
    user:{userId},
    params:{id:auditId},
  } = req

  if(auditName==='' || period==='' || year==='' || type==='') {
    throw new BadRequestError('Name, Period, Year, or Type fields cannot be empty')
  }
  const audit = await Audit.findByIdAndUpdate({_id:auditId, createdBy:userId}, req.body, {new:true,runValidators:true})

  if(!audit) {
    throw new NotFoundError(`No audit with id ${auditId} found`)
  }
  res.status(StatusCodes.OK).json({ audit })
}

const deleteAudit = async (req, res) => {
  const {
    user:{userId},
    params:{id:auditId}
  } = req

  const audit = await Audit.findByIdAndRemove({
    _id:auditId,
    createdBy:userId
  })

  if(!audit) {
    throw new NotFoundError(`No audit with id ${jobId} found`)
  }

  res.status(StatusCodes.OK).json({msg: "The entry was deleted."})
}

module.exports = {
  getAllAudits,
  getAudit,
  createAudit,
  updateAudit,
  deleteAudit,
}

