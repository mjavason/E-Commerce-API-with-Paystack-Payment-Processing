import { Injectable } from '@nestjs/common';

import { PAYSTACK_TEST_SECRET_KEY } from 'src/constants';
import ApiService from 'src/helpers/api.service';

@Injectable()
export class PayService {
  private apiService: ApiService = new ApiService('https://api.paystack.co');
  // const postData = {
  //   title: 'New Post',
  //   body: 'This is the content of the new post.',
  // };

  async initializePayment(paymentInfo: { amount: number; email: string }) {
    try {
      // POST request with bearer token in headers
      const headers = { Authorization: `Bearer ${PAYSTACK_TEST_SECRET_KEY}` };
      const responseData = await this.apiService.post<any>(
        '/transaction/initialize',
        { ...paymentInfo },
        { headers },
      );

      return responseData;
    } catch (error) {
      console.error('API Error:', error.message);

      return;
    }
  }
}
