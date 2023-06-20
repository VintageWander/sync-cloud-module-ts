import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { EnvService } from './env/env.service';
import { HttpService } from '@nestjs/axios';
import { AxiosInstance } from 'axios';
import { envConsts } from './env/env.entity';
import { Response } from 'express';
import to from 'await-to-js';
import { SetDataRequest, SetDataRequestSchema } from './dto/set-data.dto';
import { DeleteDataRequest } from './dto/delete-data.dto';
import { JoiValidationPipe } from './pipe/joi.pipe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  private readonly serviceUrl: string = '';
  private readonly axios: AxiosInstance;

  constructor(
    private readonly envService: EnvService,
    private readonly httpService: HttpService,
  ) {
    this.axios = this.httpService.axiosRef;
    this.serviceUrl = this.envService.get(envConsts.SERVICE);
  }

  @Get('/health')
  async health(@Res() res: Response): Promise<Response> {
    return res.status(200).json({
      code: 200,
      message: 'OK',
      data: 'Module functional',
      error: null,
    });
  }

  @Get('/service-health')
  async serviceHealth(@Res() res: Response): Promise<Response> {
    const { serviceUrl, axios } = this;

    const [err, result] = await to(axios.get(`${serviceUrl}/health`));

    if (err) {
      const { stack, ...error } = err;
      throw new InternalServerErrorException('Service health check failed', {
        cause: error,
      });
    }

    if (result.status === 500) {
      throw new InternalServerErrorException('Service health check failed', {
        cause: result.data.error,
      });
    }

    return res.status(200).json({
      code: 200,
      message: 'OK',
      data: 'Service functional',
      error: null,
    });
  }

  @Post('/set')
  @UsePipes(new JoiValidationPipe(SetDataRequestSchema))
  async set(
    @Body() body: SetDataRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const { serviceUrl, axios } = this;

    const [err, result] = await to(axios.post(`${serviceUrl}/sync/set`, body));

    if (err) {
      const { stack, ...error } = err;
      throw new InternalServerErrorException('Cannot send data to service', {
        cause: error,
      });
    }

    if (result.status === 500) {
      throw new InternalServerErrorException('Service error', result.data);
    }

    if (result.status === 400) {
      throw new BadRequestException('Invalid request', result.data);
    }

    return res.status(200).json({
      code: 200,
      message: 'OK',
      data: 'Set data to proxies success',
      error: null,
    });
  }

  @Delete('/delete')
  async delete(
    @Body() body: DeleteDataRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const { serviceUrl, axios } = this;

    const [err, result] = await to(
      axios.delete(`${serviceUrl}/sync/delete`, { data: body }),
    );

    if (err) {
      const { stack, ...error } = err;
      throw new InternalServerErrorException('Cannot send request to service', {
        cause: error,
      });
    }

    if (result.status === 500) {
      throw new InternalServerErrorException('Service error', result.data);
    }

    if (result.status === 400) {
      throw new BadRequestException('Invalid request', result.data);
    }

    return res.status(200).json({
      code: 200,
      message: 'OK',
      data: 'Delete data from proxies success',
      error: null,
    });
  }
}
