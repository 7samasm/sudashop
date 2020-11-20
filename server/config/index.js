const mongoose = require('mongoose')

const {
	getEnvironmentVariable,
	connectGlobalDB,
	connectLocalDB
} = require('../utils/helpers')

// dont forget to use Environment Variables in local machine or global

const getDbConnectionString = () => {
	if (getEnvironmentVariable('NODE_ENV') === 'production')
		return connectGlobalDB()
	return connectLocalDB()
}

module.exports = {

	async connectDb(cb) {
		try {
			const res = await mongoose.connect(
				getDbConnectionString(),
				{ useNewUrlParser: true, useUnifiedTopology: true },
				err => {
					if (err) throw new Error('conection failed :(')
				}
			)
			cb(err = null, res)
		} catch (error) {
			cb(error, undefined)
		}
	}

}