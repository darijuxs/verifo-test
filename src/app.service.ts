import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bent from 'bent';
import * as crypto from 'crypto';

interface VerifoConfig {
  api_key:string,
  api_secret:string,
  api_version:string,
  api_url:string;
}

let verifoConfig:VerifoConfig;

@Injectable()
export class AppService {

  constructor(private configService: ConfigService){

    verifoConfig = this.configService.get<VerifoConfig>('verifo');

}
private getNonce() {
  return Math.floor((Date.now() + Math.random()) * 100);
}

private getTimestamp() {
  return Math.floor(Date.now() / 1000) + 6;
}

private getHmacHash(message:any) {

    try {

        const CLIENT_KEY = verifoConfig.api_key
        const SECRET_KEY = verifoConfig.api_secret;
        const VERSION = verifoConfig.api_version.toUpperCase();
          
        const hmacDigest = crypto.createHmac('sha512',SECRET_KEY).update(message).digest('hex');
        
        let headerValue = VERSION+'-HMAC-SHA512 Key='+CLIENT_KEY+',Signature='+hmacDigest;
    
        return headerValue;
        
    } catch (error) {

        console.log('the error '+JSON.stringify(error))
        
    }
    
}


async createCompanyProfile(dto:any){

    try {

        const data = {
            
            name:dto.name,
            registrationCode:dto.registration_number,
            registrationDate:dto.registration_date,
            registrationCountry:dto.registration_country_code,
            legalForm:dto.legal_form,
            phone:dto.phone,
            email:dto.email
        }

        const nonce = this.getNonce();
        const timestamp = this.getTimestamp();

        const queryString = `nonce=${nonce}&timestamp=${timestamp}`
        
        const message = queryString+'|'+data;

        const header:any = this.getHmacHash(message);

        console.log('the data '+JSON.stringify(data));
        console.log('the timestamp '+timestamp);
        console.log('the nonce '+nonce);
        console.log('the header '+header);

        console.log('the url '+`${verifoConfig.api_url}/api/${verifoConfig.api_version}/company?nonce=${nonce}&timestamp=${timestamp}`)

        const post= bent('POST','json',200);

        const response = await post(`${verifoConfig.api_url}/api/${verifoConfig.api_version}/company?nonce=${nonce}&timestamp=${timestamp}`, data,header);
                 
        return [null,response]
        
    } catch (error) {

        return [error,null] 
    }

}
}
