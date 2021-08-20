//write diff json errors
import express from "express";

function successStatus(statusCode, message, data = []) {
    return res.status(statusCode).json({Message: message, data: data })
}

export {successStatus}