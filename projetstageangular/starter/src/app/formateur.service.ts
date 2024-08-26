import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formateur } from './models/formateur.model';
import { Emplois } from './models/emplois.model';
import { Classe } from './models/classe.model';
import { Salle } from './models/salle.model';
@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  private apiUrl = 'http://localhost:8000';
  constructor(private httpClient: HttpClient) {}
    addFormateur(Formateur: Formateur): Observable<any> {
      //return this.httpClient.post(this.apiUrl, Formateur);
      return this.httpClient.post(`${this.apiUrl}/addformateur`, Formateur);
    }
    updateFormateur(id:number,formateur: Formateur): Observable<any> {
      const url = `${this.apiUrl}/formateur/${id}`; // Construire l'URL avec l'ID du formateur
      return this.httpClient.put(url, formateur);
      //return this.httpClient.put<any[]>(url, formateur);
    }
    getFormateur(id: number): Observable<Formateur> {
      const url = `${this.apiUrl}/formateur/${id}`;
      return this.httpClient.get<Formateur>(url);
    }
    getFormateurs(): Observable<Formateur[]> {
      return this.httpClient.get<any[]>(`${this.apiUrl}/formateur`);
    }
    deleteFormateur(id: number): Observable<any> {
      return this.httpClient.delete<any[]>(`${this.apiUrl}/formateur/${id}`);
    }

    getEmploisByFormateur(selectedFormateurId: number, startDate: String, endDate: String): Observable<Emplois[]> {
      // Construisez l'URL avec les dates formatées
      const url = `${this.apiUrl}/emploisformateur/${selectedFormateurId}?startDate=${startDate}&endDate=${endDate}`;
      // Effectuez la requête GET avec l'URL construite
      return this.httpClient.get<Emplois[]>(url);
     }


     getClasseById(id: number): Observable<Classe> {
      const url = `${this.apiUrl}/classe/${id}`;
      return this.httpClient.get<Classe>(url);
    }

    getSalleById(id: number): Observable<Salle> {
      const url = `${this.apiUrl}/salle/${id}`;
      return this.httpClient.get<Salle>(url);
    }
 }