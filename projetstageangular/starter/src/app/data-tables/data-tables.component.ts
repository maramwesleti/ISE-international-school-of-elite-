
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Formateur } from 'app/models/formateur.model';
import { FormateurService } from 'app/formateur.service';

@Component({
  selector: 'app-datatables',
  templateUrl: './data-tables.component.html',
  styleUrls: ['./data-tables.component.scss', '../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataTablesComponent implements OnInit {
  formateurs: Formateur[];
  columns: any[] = [
    { name: 'ID', prop: 'id' },
    { name: 'Nom', prop: 'nom' },
    { name: 'Prénom', prop: 'prenom' },
    { name: 'Téléphone', prop: 'tel' },
    { name: 'Adresse', prop: 'adresse' },
    { name: 'Actions', prop: 'actions' } 
  ];

  constructor(private formateurService: FormateurService, private router: Router) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.formateurService.getFormateurs().subscribe(
      data => {
        this.formateurs = data;
      },
      error => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  updatef(id: number) {
    this.router.navigate(['/forms/update',id]);
  }

  deleteFormateur(formateur: Formateur) {
    if (confirm('Voulez-vous vraiment supprimer ce formateur ?')) {
      this.formateurService.deleteFormateur(formateur.id).subscribe(
        () => {
          // Supprimer le formateur de la liste affichée
          this.formateurs = this.formateurs.filter(f => f.id !== formateur.id);
        },
        error => {
          console.error('Erreur lors de la suppression du formateur :', error);
        }
      );
    }
  }
}
