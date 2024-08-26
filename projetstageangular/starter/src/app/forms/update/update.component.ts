import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormateurService } from 'app/formateur.service';
import { Formateur } from 'app/models/formateur.model';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  formFormateur!: FormGroup;
  formateurId: number;
  constructor(private fb:FormBuilder,private formateurService : FormateurService,private router: Router, private route: ActivatedRoute ) { }
  ngOnInit():void {
    this.route.params.subscribe(params => {
      this.formateurId = params['id'];
      this.getFormateurDetails(this.formateurId);
    });
    this.formFormateur=this.fb.group({
      id: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: ['', Validators.required],
      tel: ['', Validators.required]

    });
  }
  getFormateurDetails(id: number) {
    this.formateurService.getFormateur(id).subscribe(
      (formateur: Formateur) => {
        this.formFormateur.patchValue(formateur); // Remplir le formulaire avec les données du formateur
      },
      error => {
        console.error('Erreur lors de la récupération des données du formateur:', error);
      }
    );
  }
  submit() {
    this.formateurService. updateFormateur( this.formFormateur.value.id,this.formFormateur.value ).subscribe(
      data => {
        console.log('Post request successful', data);
        this.router.navigate(['datatables']);
      },
      error => {
        console.error('Error during post request', error);
      }
    );
  }

}
