import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';

export interface HomeCustomerProof { image: string; alt: string; }
export interface HomeTestimonial { quote: string; name: string; role: string; }

@Component({ selector: 'app-home-proof', templateUrl: './home-proof.component.html', styleUrls: ['./home-proof.component.css'] })
export class HomeProofComponent {
  readonly customers: readonly HomeCustomerProof[] = [
    { image: 'APPZPOS-Pos-System-Singapore-Bar-Stories.png', alt: 'Bar Stories' }, { image: 'APPZPOS-All-in-One-Pos-System-Wokker-Aroy-Thai.png', alt: 'A-Roy Thai Restaurant' },
    { image: 'APPZPOS-All-in-One-Pos-System-thaitogo.png', alt: 'Thai to go' }, { image: 'APPZPOS-Pos-System-Singapore-Alter-Ego.png', alt: 'Alter Ego' },
    { image: 'APPZPOS-Point-of-Sales-System-Singapore-Kei-Kaisendon.png', alt: 'Kei Kaisendon' }, { image: 'Rasa-Istimewa.png', alt: 'Rasa Istimewa' },
    { image: 'APPZPOS-Best-Pos-System-Singapore-Fresh-Fruits-Lab-Group.png', alt: 'Fresh Fruits Lab Group' }, { image: 'Soi-19.png', alt: 'Soi 19' }
  ];
  readonly testimonials: readonly HomeTestimonial[] = [
    { quote: 'We knew that this is an innovative solution at the time when Appzgate team showed us demo. Turns out that we have made the right decision to purchase their POS System. Before getting this solution, we had 5 staffs to manage different duties. However, till now, we only need 3 staffs as APPZPOS is very user friendly and able to process almost everything. As a bar, we have diverse drinks, happy hours, and promotions. Glad that we no longer have to manually note down these as we can simply set in APPZPOS backend. After setting, everything is automatic and we no longer have to manually edit. We highly recommend other bar players to take APPZPOS, as you do not have to worry about customer details, drinks modifiers, or reports management anymore. Everything becomes integrated and manageable.', name: 'Mr. Gerry', role: 'Director of Bar Stories' },
    { quote: 'APPZPOS is very stable and suitable solution for multiple outlets. Their design is trendy with user friendly interface. Easy management with access to sales report, inventory system and customer program. It is easy to manage everything together from one integrated system. APPZGATE SOLUTIONS team is reliable and efficient and have great after sales support, we will recommend them to those looking for solutions.', name: 'Mr. Chayut', role: 'Director of A-Roy Thai Restaurant' },
    { quote: 'What we like about Appzgate most is that they are very efficient and reliable. Whenever we are facing technical issues, they respond swiftly and guide us to solve the issues. We had taken APPZPOS & Website together. It is truly time saving when you have an integrated solution, whatever we update in backend would directly be pushed to website & POS system. We love how customizable APPZPOS is, with different dining modes, fast buttons and modifiers, it is time saving to take orders and manage customer database.', name: 'Ms. Erin', role: 'Marketing & Operation Manager of Thai to go' }
  ];
  activeIndex = 0;
  constructor(private readonly commonFunctionService: CommonFunctionService) {}
  imageUrl(name: string): string { return this.commonFunctionService.BindURL_Image(name); }
  select(index: number): void { this.activeIndex = index; }
}
