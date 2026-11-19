import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  // Public branding for this marketing build. Rendering must not depend on the
  // POS configuration API (which also returns unrelated operational settings).
  objConfigData: any = {
    Configuration: {
      CompanyDetails: { Company_Ref_No: '0771BB36-9631-40F2-A204-C60247E9F1E1' },
      WebsiteData: {
        Template: {
          Header: { Bit_Client_Specific_Header: 1 },
          Footer: { Bit_Client_Specific_Footer: 1 }
        },
        Navigation_Menu: { Layer_1: [], Layer_2: [], Layer_3: [] }
      }
    }
  };
}
