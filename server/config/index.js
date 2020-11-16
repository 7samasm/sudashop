// const configValues = require('./config');
const mongoose = require('mongoose')

const configValues = {
    db  : "shop",
    uname: "7admin",
    pwd  : "umTR@x7.b_whAC6"
}


const getDbConnectionString = () => {
	if (process.env.NODE_ENV === 'production')
		return `mongodb://${configValues.uname}:${encodeURIComponent(configValues.pwd)}@ds257648.mlab.com:57648/${configValues.db}`;
	return `mongodb://localhost:27017/${configValues.db}`
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