const querystring = require("querystring");
const axios = require("axios");
const jwtDecode = require("jwt-decode");
const { validationResult } = require("express-validator");
const consts = require("../utils/consts");

const decode = token => {
  return token ? jwtDecode(token) : null;
};

/**
 * Handle possibility where token endpoint, at exp returns seconds instead of µ seconds
 */
const handleTokenExp = exp => {
  let out = exp;

  const milliseconds = new Date().getTime();
  // const millisecondsDigitCount = ((milliseconds).toString()).length
  const seconds = Math.floor(milliseconds / 1000);
  const secondsDigitCount = seconds.toString().length;

  const isExpressedInSeconds = exp.toString().length === secondsDigitCount;
  // const isExpressedInMilliSeconds = ((exp).toString()).length === millisecondsDigitCount

  // If the exp is 25 hours or less, adjust the time to miliseconds
  // Otherwise let's not touch it
  if (isExpressedInSeconds) {
    const durationInSeconds = Math.floor(exp - seconds);
    const hours = Math.floor(durationInSeconds / 3600);
    if (hours < 25) {
      // Make 25 configurable?
      out *= 1000;
    }
  }

  return out;
};

/**
 * Make an async off-the-band POST request.
 *
 * Notice that LB_ADDR can be superseeded to your own backend
 * instead of mocking (static) endpoint.
 *
 * Differeciation factor is when you use /hpi, Koa will take care of it
 * and yours MUST therefore NOT start by /hpi, and Koa will be out of the way.
 *
 * All of this is done when you set your own LB_ADDR environment setup
 * to point to your own API.
 */
const createRequest = async (method, url, requestConfig) => {
  const { payload = null, ...restOfRequestConfig } = requestConfig;
  const requestConfigObj = {
    timeout: consts.AXIOS_DEFAULT_TIMEOUT,
    baseURL: consts.LB_ADDR,
    method,
    url,
    ...restOfRequestConfig
  };
  if (payload !== null) {
    requestConfigObj.data = querystring.stringify(payload);
  }

  const recv = await axios.request(requestConfigObj);
  const data = Object.assign({}, recv.data);

  return Promise.resolve(data);
};

const getUserData = async token => {
  const userinfo = ["DisplayName", "PreferredLanguage", "TimeZone"];
  const params = {
    Token: token,
    userinfo: userinfo.join(",")
  };

  /**
   * Would create a request like this;
   *
   *     GET /platform/uaano/oauth/validate?Token=111.222.333&userinfo=PreferredLanguage,TimeZone
   */
  const response = await createRequest(
    "GET",
    consts.ENDPOINT_BACKEND_VALIDATE,
    { params }
  );

  const body = {
    status: response.Status
  };
  body.UserInfo = response.UserInfo || {};

  return Promise.resolve(body);
};

const emitErrors = (ctx, error) => {
  ctx.status = error.status || 500;
  ctx.body = error.message;
  ctx.app.emit("error", error, ctx);
};

const getEnvironmentVariable = variable => process.env[variable];
const getGlobalDBUrl = () =>
  `mongodb://${process.env[consts.DB_USERNAME]}:${
    process.env[consts.DB_PASSWORD]
  }@${process.env[consts.DB]}-mongodb.services.clever-cloud.com:27017/${
    process.env[consts.DB]
  }`;
const getLocalDBUrl = () =>
  `mongodb://localhost:27017/${process.env[consts.DB]}`;

const validResult = req => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    for (const err of errs.array()) {
      const e = new Error(`${err.msg} in ${err.param} input!`);
      e.statusCode = 422;
      e.data = errs.array();
      console.log(e);
      throw e;
    }
  }
};

module.exports = {
  decode,
  handleTokenExp,
  createRequest,
  getUserData,
  emitErrors,
  getEnvironmentVariable,
  getGlobalDBUrl,
  getLocalDBUrl,
  validResult
};
