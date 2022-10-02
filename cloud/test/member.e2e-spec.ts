import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { initTest } from './util';

describe('MemberController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initTest();
    // 初始化创建所有会员（仅供测试）
    await request(app.getHttpServer()).post('/api/members/all?token=123');
  });

  describe('members/ (GET)', () => {
    it('获取不存在的会员 return 404', () => {
      return request(app.getHttpServer())
        .get('/api/members/987654321')
        .expect(404);
    });
    it('获取存在已过期的会员 return 200 and enable false', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/members/20200801',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        steamId: 20200801,
        expireDateString: '2020-08-01',
        enable: false,
      });
    });
    it('获取存在且有效的会员 return 200 and enable true', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/members/20300801',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        steamId: 20300801,
        expireDateString: '2030-08-01',
        enable: true,
      });
    });
  });

  describe('members/ (POST)', () => {
    it('开通一个月会员 新建 检测会员数据储存是否一致', async () => {
      const dateNextMonth = new Date();
      dateNextMonth.setUTCDate(
        new Date().getUTCDate() + +process.env.DAYS_PER_MONTH,
      );
      const expectBodyJson = {
        steamId: 123456789,
        expireDateString: dateNextMonth.toISOString().split('T')[0],
        enable: true,
      };

      const responseBefore = await request(app.getHttpServer()).get(
        '/api/members/123456789',
      );
      expect(responseBefore.status).toEqual(404);

      const responseCreate = await request(app.getHttpServer())
        .post('/api/members')
        .send({
          steamId: 123456789,
          month: 1,
        })
        .query({ token: 123 });
      expect(responseCreate.status).toEqual(201);
      expect(responseCreate.body).toEqual(expectBodyJson);

      const responseAfter = await request(app.getHttpServer()).get(
        '/api/members/123456789',
      );
      expect(responseAfter.status).toEqual(200);
      expect(responseAfter.body).toEqual(expectBodyJson);
    });

    it('开通一个月会员 有效期过去 检测会员数据储存是否一致', async () => {
      const dateNextMonth = new Date();
      dateNextMonth.setUTCDate(
        new Date().getUTCDate() + +process.env.DAYS_PER_MONTH,
      );
      const expectBodyJson = {
        steamId: 20201231,
        expireDateString: dateNextMonth.toISOString().split('T')[0],
        enable: true,
      };

      const responseBefore = await request(app.getHttpServer()).get(
        '/api/members/20201231',
      );
      expect(responseBefore.status).toEqual(200);

      const responseCreate = await request(app.getHttpServer())
        .post('/api/members')
        .send({
          steamId: 20201231,
          month: 1,
        })
        .query({ token: 123 });
      expect(responseCreate.status).toEqual(201);
      expect(responseCreate.body).toEqual(expectBodyJson);

      const responseAfter = await request(app.getHttpServer()).get(
        '/api/members/20201231',
      );
      expect(responseAfter.status).toEqual(200);
      expect(responseAfter.body).toEqual(expectBodyJson);
    });

    it('开通一个月会员 有效期在未来 检测会员数据储存是否一致', async () => {
      const expectBodyJson = {
        steamId: 20301231,
        expireDateString: '2031-01-31',
        enable: true,
      };

      const responseBefore = await request(app.getHttpServer()).get(
        '/api/members/20301231',
      );
      expect(responseBefore.status).toEqual(200);

      const responseCreate = await request(app.getHttpServer())
        .post('/api/members')
        .send({
          steamId: 20301231,
          month: 1,
        })
        .query({ token: 123 });
      expect(responseCreate.status).toEqual(201);
      expect(responseCreate.body).toEqual(expectBodyJson);

      const responseAfter = await request(app.getHttpServer()).get(
        '/api/members/20301231',
      );
      expect(responseAfter.status).toEqual(200);
      expect(responseAfter.body).toEqual(expectBodyJson);
    });
    it('开通复数月会员 新建', async () => {
      const dateNextMonth = new Date();
      dateNextMonth.setUTCDate(
        new Date().getUTCDate() + +process.env.DAYS_PER_MONTH * 13,
      );
      const expectBodyJson = {
        steamId: 1234567890,
        expireDateString: dateNextMonth.toISOString().split('T')[0],
        enable: true,
      };

      const responseCreate = await request(app.getHttpServer())
        .post('/api/members')
        .send({
          steamId: 1234567890,
          month: 13,
        })
        .query({ token: 123 });
      expect(responseCreate.status).toEqual(201);
      expect(responseCreate.body).toEqual(expectBodyJson);
    });
    it('开通复数月会员 有效期在过去', async () => {
      const dateNextMonth = new Date();
      dateNextMonth.setUTCDate(
        new Date().getUTCDate() + +process.env.DAYS_PER_MONTH * 3,
      );
      const expectBodyJson = {
        steamId: 20200801,
        expireDateString: dateNextMonth.toISOString().split('T')[0],
        enable: true,
      };

      const responseCreate = await request(app.getHttpServer())
        .post('/api/members')
        .send({
          steamId: 20200801,
          month: 3,
        })
        .query({ token: 123 });
      expect(responseCreate.status).toEqual(201);
      expect(responseCreate.body).toEqual(expectBodyJson);
    });
    it('开通复数月会员 有效期在未来', async () => {
      const expectBodyJson = {
        steamId: 20300801,
        expireDateString: '2031-08-08',
        enable: true,
      };

      const responseCreate = await request(app.getHttpServer())
        .post('/api/members')
        .send({
          steamId: 20300801,
          month: 12,
        })
        .query({ token: 123 });
      expect(responseCreate.status).toEqual(201);
      expect(responseCreate.body).toEqual(expectBodyJson);
    });
  });

  // ======================== 爱发电自动开通会员 ========================
  describe('members/afdian/ (POST)', () => {
    describe('Request Validation', () => {
      it('ec not equal 200', async () => {
        const responseCreate = await request(app.getHttpServer())
          .post('/api/members/afdian')
          .send({
            ec: 500,
            em: 'ok',
            data: {
              type: 'order',
              order: {},
            },
          });
        expect(responseCreate.status).toEqual(400);
      });

      it('order not exist', async () => {
        const responseCreate = await request(app.getHttpServer())
          .post('/api/members/afdian')
          .send({
            ec: 200,
            em: 'ok',
          });
        expect(responseCreate.status).toEqual(400);
      });
      it('order not exist', async () => {
        const responseCreate = await request(app.getHttpServer())
          .post('/api/members/afdian')
          .send({
            ec: 200,
            em: 'ok',
          });
        expect(responseCreate.status).toEqual(400);
      });
    });

    it('爱发电Webhook返回成功 address_address', async () => {
      const memberId = 200000100;
      const dateNextMonth = new Date();
      dateNextMonth.setUTCDate(
        new Date().getUTCDate() + +process.env.DAYS_PER_MONTH,
      );
      const expectBodyJson = {
        steamId: memberId,
        expireDateString: dateNextMonth.toISOString().split('T')[0],
        enable: true,
      };
      const responseCreate = await request(app.getHttpServer())
        .post('/api/members/afdian')
        .send({
          ec: 200,
          em: 'ok',
          data: {
            type: 'order',
            order: {
              out_trade_no: '202106232138371083454010626',
              user_id: 'adf397fe8374811eaacee52540025c377',
              plan_id: 'a45353328af911eb973052540025c377',
              month: 1,
              total_amount: '5.00',
              show_amount: '5.00',
              status: 2,
              remark: '',
              redeem_id: '',
              product_type: 0,
              discount: '0.00',
              sku_detail: [],
              address_person: '',
              address_phone: '',
              address_address: `${memberId}`,
            },
          },
        });
      expect(responseCreate.status).toEqual(201);
      expect(responseCreate.body).toEqual({ ec: 200, em: 'ok' });

      const responseAfter = await request(app.getHttpServer()).get(
        `/api/members/${memberId}`,
      );
      expect(responseAfter.status).toEqual(200);
      expect(responseAfter.body).toEqual(expectBodyJson);
    });
  });

  it('爱发电Webhook返回成功 address_phone', async () => {
    const memberId = 200000101;
    const month = 3;
    const dateNextMonth = new Date();
    dateNextMonth.setUTCDate(
      new Date().getUTCDate() + +process.env.DAYS_PER_MONTH * month,
    );
    const expectBodyJson = {
      steamId: memberId,
      expireDateString: dateNextMonth.toISOString().split('T')[0],
      enable: true,
    };
    const responseCreate = await request(app.getHttpServer())
      .post('/api/members/afdian')
      .send({
        ec: 200,
        em: 'ok',
        data: {
          type: 'order',
          order: {
            out_trade_no: '202106232138371083454010626',
            user_id: 'adf397fe8374811eaacee52540025c377',
            plan_id: 'a45353328af911eb973052540025c377',
            month: month,
            total_amount: '5.00',
            show_amount: '5.00',
            status: 2,
            remark: '',
            redeem_id: '',
            product_type: 0,
            discount: '0.00',
            sku_detail: [],
            address_person: '',
            address_phone: `${memberId}`,
            address_address: '123456',
          },
        },
      });
    expect(responseCreate.status).toEqual(201);
    expect(responseCreate.body).toEqual({ ec: 200, em: 'ok' });

    const responseAfter = await request(app.getHttpServer()).get(
      `/api/members/${memberId}`,
    );
    expect(responseAfter.status).toEqual(200);
    expect(responseAfter.body).toEqual(expectBodyJson);
  });

  it('爱发电Webhook返回成功 address_person', async () => {
    const memberId = 200000102;
    const month = 6;
    const dateNextMonth = new Date();
    dateNextMonth.setUTCDate(
      new Date().getUTCDate() + +process.env.DAYS_PER_MONTH * month,
    );
    const expectBodyJson = {
      steamId: memberId,
      expireDateString: dateNextMonth.toISOString().split('T')[0],
      enable: true,
    };
    const responseCreate = await request(app.getHttpServer())
      .post('/api/members/afdian')
      .send({
        ec: 200,
        em: 'ok',
        data: {
          type: 'order',
          order: {
            out_trade_no: '202106232138371083454010626',
            user_id: 'adf397fe8374811eaacee52540025c377',
            plan_id: 'a45353328af911eb973052540025c377',
            month: month,
            total_amount: '5.00',
            show_amount: '5.00',
            status: 2,
            remark: '',
            redeem_id: '',
            product_type: 0,
            discount: '0.00',
            sku_detail: [],
            address_person: `${memberId}`,
            address_phone: '12345678901',
            address_address: '1234567',
          },
        },
      });
    expect(responseCreate.status).toEqual(201);
    expect(responseCreate.body).toEqual({ ec: 200, em: 'ok' });

    const responseAfter = await request(app.getHttpServer()).get(
      `/api/members/${memberId}`,
    );
    expect(responseAfter.status).toEqual(200);
    expect(responseAfter.body).toEqual(expectBodyJson);
  });

  it('爱发电Webhook返回成功 remark', async () => {
    const memberId = 200000103;
    const month = 12;
    const dateNextMonth = new Date();
    dateNextMonth.setUTCDate(
      new Date().getUTCDate() + +process.env.DAYS_PER_MONTH * month,
    );
    const expectBodyJson = {
      steamId: memberId,
      expireDateString: dateNextMonth.toISOString().split('T')[0],
      enable: true,
    };
    const responseCreate = await request(app.getHttpServer())
      .post('/api/members/afdian')
      .send({
        ec: 200,
        em: 'ok',
        data: {
          type: 'order',
          order: {
            out_trade_no: '202106232138371083454010626',
            user_id: 'adf397fe8374811eaacee52540025c377',
            plan_id: 'a45353328af911eb973052540025c377',
            month: month,
            total_amount: '5.00',
            show_amount: '5.00',
            status: 2,
            remark: `${memberId}`,
            redeem_id: '',
            product_type: 0,
            discount: '0.00',
            sku_detail: [],
            address_person: 'name',
            address_phone: '12345678901',
            address_address: '1234567',
          },
        },
      });
    expect(responseCreate.status).toEqual(201);
    expect(responseCreate.body).toEqual({ ec: 200, em: 'ok' });

    const responseAfter = await request(app.getHttpServer()).get(
      `/api/members/${memberId}`,
    );
    expect(responseAfter.status).toEqual(200);
    expect(responseAfter.body).toEqual(expectBodyJson);
  });

  it('爱发电Webhook开通失败 信息不全', async () => {
    const memberId = 200000110;
    const month = 12;
    const dateNextMonth = new Date();
    dateNextMonth.setUTCDate(
      new Date().getUTCDate() + +process.env.DAYS_PER_MONTH * month,
    );
    const responseCreate = await request(app.getHttpServer())
      .post('/api/members/afdian')
      .send({
        ec: 200,
        em: 'ok',
        data: {
          type: 'order',
          order: {
            out_trade_no: '202106232138371083454010626',
            user_id: 'adf397fe8374811eaacee52540025c377',
            plan_id: 'a45353328af911eb973052540025c377',
            month: month,
            total_amount: '5.00',
            show_amount: '5.00',
            status: 2,
            remark: 'xxxx message',
            redeem_id: '',
            product_type: 0,
            discount: '0.00',
            sku_detail: [],
            address_person: 'name',
            address_phone: '12345678901',
            address_address: '1234567',
          },
        },
      });
    expect(responseCreate.status).toEqual(201);
    expect(responseCreate.body).toEqual({ ec: 200, em: 'ok' });

    const responseAfter = await request(app.getHttpServer()).get(
      `/api/members/${memberId}`,
    );
    expect(responseAfter.status).toEqual(404);
  });
  afterAll(async () => {
    await app.close();
  });
});
