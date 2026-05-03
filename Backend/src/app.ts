import express from "express";

const app = express()

app.use(express.urlencoded({limit: "20kb"}))
