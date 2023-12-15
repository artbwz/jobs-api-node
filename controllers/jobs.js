const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const NodeCache = require('node-cache')

const cache = new NodeCache({ stdTTL: 600 })

const getAllJobs = async (req, res) => {
    const jobs = await Job.findAll({
      where: { createdBy: req.user.userId },
      order: [['createdAt', 'ASC']],
    })

    res.status(200).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req
  const job = await Job.findOne({
    where: {
      id: jobId,
      createdBy: userId,
    },
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req

  if (company === '' || position === '') {
    throw new BadRequestError('Company or position empty')
  }
  
  const findJobById = await Job.findOne({
    where:{id:jobId,createdBy:userId}
  })

  if (!findJobById) {
    throw new NotFoundError('Job id not foud')
  }

  if (company) findJobById.company = company
  if (position) findJobById.position = position
  const updateJob = await findJobById.save()

  if(!updateJob){
    throw new BadRequestError('Company or position empty')
  }

  res.status(StatusCodes.OK).json({ updateJob })
}

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
  } = req

  const job = await Job.destroy({where:{id:jobId}})

  if (!job){
    throw new NotFoundError('Job id not foud')
  }

  res.send(`Job ${jobId} deleted with sucess.`)
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
}
