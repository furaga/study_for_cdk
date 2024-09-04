import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class ReactDeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3バケットの作成
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `my-react-app-bucket-${this.account}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // スタック削除時にバケットも削除
      autoDeleteObjects: true, // バケット内のオブジェクトも自動削除
    });

    
    // CloudFront OACの作成
    const cloudfrontOAC = new cloudfront.CfnOriginAccessControl(this, 'CloudFrontOAC', {
      originAccessControlConfig: {
        name: 'OAC for S3',
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
      },
    });

    // CloudFront ディストリビューションの作成
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // S3バケットポリシーの更新
    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [siteBucket.arnForObjects('*')],
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
      conditions: {
        StringEquals: {
          'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`
        }
      }
    }));


    // OACをCloudFrontディストリビューションに関連付け
    const cfnDistribution = distribution.node.defaultChild as cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', cloudfrontOAC.attrId);
    cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.DomainName', siteBucket.bucketRegionalDomainName)
    cfnDistribution.addOverride('Properties.DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity', "")
    cfnDistribution.addPropertyDeletionOverride('DistributionConfig.Origins.0.CustomOriginConfig')


    // S3へのデプロイメント
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('../build')], // Reactビルド出力のパス
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // CloudFrontのURLを出力
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'Website URL',
    });
  }
}