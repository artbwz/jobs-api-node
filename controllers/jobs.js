const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const NodeCache = require('node-cache')

const cache = new NodeCache({ stdTTL: 600 })

const getAllJobs = async (req, res) => {
  try {
    const key = `user_${req.user.userId}_jobs`
    const cachedJobs = cache.get(key)

    if (cachedJobs) {
      return res.status(200).json({ jobs: cachedJobs, count: cachedJobs.length })
    }
    const jobs = await Job.findAll({
      where: { createdBy: req.user.userId },
      order: [['createdAt', 'ASC']],
    })
    cache.set(key, jobs)
    res.status(200).json({ jobs, count: jobs.length })
  } catch (error) {
    console.log(error)
  }
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
  const job = await Job.upsert(req.body, {
    where: { id: jobId, createdBy: userId },
  })

  if (!job) {
    throw new NotFoundError('Job id not foud')
  }

  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
  res.send('Delete Jobs')
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
}
