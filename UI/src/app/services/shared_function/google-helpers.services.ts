import { Injectable } from '@angular/core';

@Injectable()
export class GoogleAnalyticsHelpersService {
  constructor() {}
  
  static LoadGoogleTag(tagID: string): void {
    let node = document.createElement('script'); // creates the script tag
    node.type = 'text/javascript'; // set the script type
    node.text=`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','`+tagID+`');
    `;
    node.async = true; // makes script run asynchronously
    document.getElementsByTagName('head')[0].appendChild(node); 
  } 
  static LoadGoogleIFrame(tagID:string):void{
    let node = document.createElement('iframe');
    node.src="https://www.googletagmanager.com/ns.html?id="+tagID;
    node.height="0";
    node.width="0";
    node.style.display="none";
    node.style.visibility="hidden";
     document.getElementsByTagName('body')[0].appendChild(node); 
  }
}