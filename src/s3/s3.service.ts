import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
  }

  async saveImages(files: Express.Multer.File[]): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => this.imageUpload(file));
    return await Promise.all(uploadPromises);
  }

  async imageUpload(file: Express.Multer.File): Promise<UploadResult> {
    const imageName = uuidv4();

    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );
    return { imageUrl };
  }

  async imageUploadToS3(
    fileName: string,
    file: Express.Multer.File,
    ext: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });

    try {
      await this.s3Client.send(command);
    } catch {
      throw new InternalServerErrorException(
        '이미지 저장 중 오류가 발생했습니다.',
      );
    }

    return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
  }
}
