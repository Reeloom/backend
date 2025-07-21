import * as http from 'http';
import express from 'config/express';

export const httpServer = http.createServer(express);
