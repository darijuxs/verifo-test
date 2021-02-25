import { Controller, Get,HttpCode,Post,Body} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
 async getHello() {

    const data = {
                
      name:"Ebior B.V",
      registrationCode:"123456",
      registrationDate:"2010-02-12",
      registrationCountry:"NL",
      legalForm:'holding_company',
      phone:'+31630845672',
      email:"yulemata@gmail.com"
  }

    const [error,response] = await this.appService.createCompanyProfile(data)
    
    if (error){
      return error
  }

  return response 
  }
}
