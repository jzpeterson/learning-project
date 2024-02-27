import {Bucket} from "sst/node/bucket";
import {Config} from "sst/node/config";
import cloudconvert from 'cloudconvert';
// @ts-ignore
console.log("CloudConvert Object: ", cloudconvert.default)
// @ts-ignore
const CloudConvert = cloudconvert.default;

export class ConverterService {
    private readonly CLOUD_CONVERT_API_KEY: string;
    private readonly AWS_ACCESS_KEY_ID: string;
    private readonly AWS_SECRET_ACCESS_KEY: string;
    private readonly AWS_REGION: string;
    private cloudConvertApi: any;
    private readonly BUCKET_NAME: string;

    constructor() {
        this.CLOUD_CONVERT_API_KEY = Config.CLOUD_CONVERT_API_KEY;
        this.AWS_REGION = 'us-west-2'; // TODO get this from some type of aws config file or variable
        this.AWS_ACCESS_KEY_ID = Config.AWS_ACCESS_KEY_ID;
        this.AWS_SECRET_ACCESS_KEY = Config.AWS_SECRET_ACCESS_KEY;
        this.cloudConvertApi = new CloudConvert(this.CLOUD_CONVERT_API_KEY, false);
        this.BUCKET_NAME = Bucket.VideoStorageBucket.bucketName;
    }

    public async convertAndUpload(inputFileUrl: string, keyPrefix: string, outputKey: string): Promise<string> {
        console.log('Converting and uploading file:', inputFileUrl, keyPrefix, outputKey)
        await this.convertAndUploadViaSynchronousCloudfrontJob(inputFileUrl,
            this.AWS_ACCESS_KEY_ID,
            this.AWS_SECRET_ACCESS_KEY,
            this.AWS_REGION,
            this.BUCKET_NAME,
            keyPrefix,
            outputKey)

        return await this.buildS3Url(this.BUCKET_NAME, this.AWS_REGION, keyPrefix, outputKey);
    }

    private async buildS3Url(bucketName: string, awsRegion: string, keyPrefix: string, key: string): Promise<string> {
        const encodedKeyPrefix = encodeURIComponent(keyPrefix);
        const encodedKey = encodeURIComponent(key);
        const s3Url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${encodedKeyPrefix}/${encodedKey}`;
        console.log('Built S3 URL:', s3Url);
        return s3Url;
    }

    private async convertAndUploadViaSynchronousCloudfrontJob(inputFileUrl: string,
                                                              awsAccessKeyId: string,
                                                              awsSecretAccessKeyId: string,
                                                              awsRegion: string,
                                                              bucketName: string,
                                                              keyPrefix: string,
                                                              key: string): Promise<void> {
        console.log('Converting and uploading file:', inputFileUrl, keyPrefix, key)
        console.log('AWS_REGION:', awsRegion)
        console.log('BUCKET_NAME:', bucketName)
        try {
            // TODO: Make this a secure scalable approach that uses minimum permissions and
            // is not synchronous.
            console.log('Creating CloudConvert job')
            let job = await this.cloudConvertApi.jobs.create({
                "tasks": {
                    "import-file": {
                        "operation": "import/url",
                        "url": inputFileUrl
                    },
                    "convert-file-to-mp4": {
                        "operation": "convert",
                        "input": [
                            "import-file"
                        ],
                        "output_format": "mp4"
                    },
                    "export-file-to-s3": {
                        "operation": "export/s3",
                        "input": [
                            "convert-file-to-mp4"
                        ],
                        "bucket": bucketName,
                        "region": awsRegion,
                        "access_key_id": awsAccessKeyId,
                        "secret_access_key": awsSecretAccessKeyId,
                        "acl": "public-read", // Needed to make the file accessible to frontend TODO make this secure
                        "key_prefix": keyPrefix,
                        "key": key
                    }
                },
                "tag": "jobbuilder"
            });
            console.log('Created CloudConvert job:', job);
            console.log('Waiting for CloudConvert job to complete');
            job = await this.cloudConvertApi.jobs.wait(job.id);
            console.log("CloudConvert job completed", job);
        } catch (error) {
            console.error('Failed to convert and upload file:', error);
            throw error;
        }
    }
}
