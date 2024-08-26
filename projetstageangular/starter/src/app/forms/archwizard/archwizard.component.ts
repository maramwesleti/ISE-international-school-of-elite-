import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {  FormGroup, Validators,  FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FormateurService } from 'app/formateur.service';


@Component({
  selector: 'app-archwizard',
  templateUrl: './archwizard.component.html',
  styleUrls: ['./archwizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchwizardComponent implements OnInit {
  formFormateur!: FormGroup;
  constructor(private fb:FormBuilder,private formateurService : FormateurService,private route: Router ) {}

  ngOnInit():void {
    this.formFormateur=this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: ['', Validators.required],
      tel: ['', Validators.required]

    });
  }

  submit() {
    this.formateurService.addFormateur(this.formFormateur.value).subscribe(
      data => {
        console.log('Post request successful', data);
        this.route.navigate(['datatables']);
      },
      error => {
        console.error('Error during post request', error);
      }
    );
  }


}
