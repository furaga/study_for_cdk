#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ReactDeploymentStack } from '../lib/react-deployment-cdk-stack';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();
new ReactDeploymentStack(app, 'ReactDeploymentStack', {
    env: { 
      account: process.env.AWS_ACCOUNT, 
      region: process.env.AWS_DEFAULT_REGION 
    }
});
