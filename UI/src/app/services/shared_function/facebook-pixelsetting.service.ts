import { Injectable } from '@angular/core';

@Injectable()
export class FacebookPixelSettingService{
    constructor(){}

    static LoadFacebookPixelSetting(pixelID:string):void{
        let node = document.createElement('script'); //create the script tag
        node.type = 'text/javascript'; //set the script type 
        node.text = `
        !function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '`+pixelID+`'); 
fbq('track', 'PageView');
        `;
        node.async = true; //make script run asynchronously
        document.getElementsByTagName('head')[0].appendChild(node);
    }
    static LoadFaceBookImgPixelCode(pixelID:string):void{
        let node = document.createElement('img');
        node.src="https://www.facebook.com/tr?id="+pixelID+"&ev=PageView&noscript=1";
        node.height=1;
        node.width=1;
        node.style.display="none";
         document.getElementsByTagName('head')[0].appendChild(node); 
    }
}
