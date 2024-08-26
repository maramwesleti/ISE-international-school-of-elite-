import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { NgbDateStruct  } from '@ng-bootstrap/ng-bootstrap';
import { FormateurService } from 'app/formateur.service';
import { Formateur } from 'app/models/formateur.model';
import { Emplois } from 'app/models/emplois.model';
import { FormBuilder } from '@angular/forms';
import { Classe } from 'app/models/classe.model';
import { Salle } from 'app/models/salle.model';
const coutheure = 20;

const now = new Date();
const I18N_VALUES = {
  en: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
};

// Range datepicker Start
const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;
// Range datepicker Ends

export class User {
  public fname: string;
  public lname: string;
  public city: string;
}

@Component({
  selector: 'app-validation-forms',
  templateUrl: './validation-forms.component.html',
  styleUrls: ['./validation-forms.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class ValidationFormsComponent implements OnInit {
  total: number = 0;
  showTotal() {
    this.total = this.getTotal();
  }


  getTotal(): number {
    let total = 0;
    this.emplois.forEach((emploi) => {
      // Vérifie si la case à cocher est cochée
      if (emploi.presence) {
        total += emploi.totale;
      }
    });
    return total;
  }

  onCheckboxChange(row: any, newValue: boolean) {
    row.presence = newValue; // Mettre à jour la propriété 'presence' de l'objet d'emploi
  }
 
  constructor(private formateurService: FormateurService, private fb: FormBuilder) { }

 formateurs: { id: number, nomComplet: string }[] = [];
 emplois: Emplois[];
  columns: any[] = [
    { name: 'date', prop: 'date_jour' },
    { name: 'classe', prop: 'classe_id' },
    { name: 'salle', prop: 'salle_id' },
    { name: 'nombre dheure', prop: '' },
    { name: 'cout heure', prop: '' },
    { name: 'totale', prop: '' } ,
    { name: 'presence', prop: '' } 
  ];
  myForm: FormGroup = this.fb.group({
    startDate: [new Date(), Validators.required], // Initialisez avec la date actuelle par défaut
    endDate: [new Date(), Validators.required], // Initialisez avec la date actuelle par défaut
    selectedFormateurId: [null, Validators.required] // Utilisez Validators.required pour rendre le choix du formateur obligatoire
  });


   // Variable declaration
  
   d: any;
   d2: any;
   d3: any;
   model: NgbDateStruct;
   popupModel;
   date: {year: number, month: number};
   displayMonths = 2;
   navigation = 'select';
   disabledModel: NgbDateStruct = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
   disabled = true;
   customModel: NgbDateStruct;
 
   configModal;    // Global configuration of datepickers
 
 
   // Range datepicker start
   hoveredDate: NgbDateStruct;
 
   fromDate: NgbDateStruct;
   toDate: NgbDateStruct;
rows: any;
searchTerm: any;
selectedformateur: any;
//debut: Date;
//fin: Date;
//selectedFormateurId: null ;
selectedFormateurId: number ;
startDate: Date = new Date();
endDate: Date = new Date();
 
   // Range datepicker starts
   onDateChange(date: NgbDateStruct) {
     if (!this.fromDate && !this.toDate) {
       this.fromDate = date;
     } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
       this.toDate = date;
     } else {
       this.toDate = null;
       this.fromDate = date;
     }
   }
 
   isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
   isInside = date => after(date, this.fromDate) && before(date, this.toDate);
   isFrom = date => equals(date, this.fromDate);
   isTo = date => equals(date, this.toDate);
   // Range datepicker ends
 
 
   // Selects today's date
   selectToday() {
     this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
   }
 
   // Custom Day View Starts
   isWeekend(date: NgbDateStruct) {
     const d = new Date(date.year, date.month - 1, date.day);
     return d.getDay() === 0 || d.getDay() === 6;
   }
 
   isDisabled(date: NgbDateStruct, current: {month: number}) {
     return date.month !== current.month;
   }

   // Custom Day View Ends
  //constructor(private formateurService: FormateurService) {
//formateurs: { id: number, nomComplet: string }[] = []; // Utilisez un tableau d'objets avec une propriété "nomComplet";

    

  
  
    ngOnInit(): void {
      this.getFormateurs();
      this.selectToday();
    
    
    }
  
  
    getFormateurs(): void {
      this.formateurService.getFormateurs()
        .subscribe(formateurs => {
          // Transformez les données récupérées pour créer un tableau d'objets avec une propriété "nomComplet"
          this.formateurs = formateurs.map(formateur => ({
            id: formateur.id,
            nomComplet: `${formateur.nom} ${formateur.prenom}`
          }));
        });
    }

    onFormSubmit(){
      if (this.myForm.valid) {
        // Récupération des valeurs du formulaire
        const selectedFormateurId = this.myForm.value.selectedFormateurId;
        console.log(selectedFormateurId);
    
        // Convertir les dates en chaînes de caractères au format ISO
        const startDate = this.formatNgbDate(this.myForm.value.startDate);
        console.log(startDate);
    
        let endDate = this.formatNgbDate(this.myForm.value.endDate);
        console.log(endDate);

        endDate = this.addDays(endDate, 1);
        // Appel au service pour récupérer les emplois
        this.formateurService.getEmploisByFormateur(selectedFormateurId, startDate, endDate)
          .subscribe(
            (emplois: Emplois[]) => {
              for (const emploi of emplois) {
                this.formateurService.getClasseById(emploi.classe_id)
                  .subscribe((classe: Classe) => {
                    emploi.niveau = classe.niveau;
                  });
                  this.formateurService.getSalleById(emploi.classe_id)
                  .subscribe((salle: Salle) => {
                    emploi.libelle = salle.libelle;
                  });
                  emploi.nbheure = emploi.fin - emploi.debut;
                  emploi.totale = emploi.nbheure * coutheure;

              }

             
              this.emplois = emplois;
            },
            (error) => {
              console.error('Une erreur s\'est produite :', error);
              // Gestion des erreurs
              // Afficher un message d'erreur ou prendre d'autres mesures
            }
          );
      } else {
        alert('Veuillez remplir tous les champs du formulaire');
      }
    }
    
    formatNgbDate(ngbDate: NgbDateStruct): string {
      if (ngbDate) {
        // Convertir NgbDate en Date
        const date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day );
        // Convertir Date en chaîne de caractères au format ISO
        return date.toISOString();
      }
      return '';
    }
    addDays(date: string, days: number): string {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result.toISOString();
    }
    
   }

