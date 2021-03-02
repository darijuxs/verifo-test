import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bent from 'bent';
import * as crypto from 'crypto';

interface VerifoConfig {
  api_key:string,
  api_secret:string,
  api_version:string,
  api_url:string;
  api_domain:string;
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
            registrationCode:dto.registrationCode,
            registrationDate:dto.registrationDate,
            registrationCountry:dto.registrationCountry,
            legalForm:dto.legalForm,
            phone:dto.phone,
            email:dto.email
        }

        const dataStringify = JSON.stringify(data);

        const nonce = this.getNonce();
        const timestamp = this.getTimestamp();
        const queryString = `/api/${verifoConfig.api_version}/company?nonce=${nonce}&timestamp=${timestamp}`

        const message = queryString+'|'+ dataStringify;

        const header:any = this.getHmacHash(message);

        console.log('the data: '+dataStringify);
        console.log('the timestamp: '+timestamp);
        console.log('the nonce: '+nonce);
        console.log('the header: '+header);
        console.log('the url: '+`${verifoConfig.api_url}`+queryString)

        // const post= bent('POST','json',200);
        // const response = await post(`${verifoConfig.api_url}/api/${verifoConfig.api_version}/company?nonce=${nonce}&timestamp=${timestamp}`, data2, headesr);

        // const https = require('https')
        // const options = {
        //     hostname: verifoConfig.api_domain,
        //     port: 443,
        //     path: queryString,
        //     method: 'POST',
        //     headers: {
        //         'Authorization': header,
        //         'Content-Type': 'application/json',
        //         'Content-Length': dataStringify.length
        //     }
        // }
        //
        // const req = https.request(options, res => {
        //     console.log(`statusCode: ${res.statusCode}`)
        //
        //     res.on('data', d => {
        //         console.log(`response: ${d}`)
        //     })
        // });
        //
        // req.on('error', error => {
        //     console.error(error)
        // })
        //
        // req.write(dataStringify)
        // req.end();



        const axios = require('axios');

        let config = {
            headers: {
                'Authorization': header,
                'Content-Type': 'application/json',
                'Content-Length': dataStringify.length
            }
        }

        axios.post(verifoConfig.api_url+queryString, data, config)
            .then(res => {
                console.log(res.data.data);
                console.log(`statusCode `+res.status);
            })
            .catch(error => {
                console.error(error.response)
            })


        return [null,null]
        // return [null,response]

    } catch (error) {

        return [error,null]
    }
}
}
