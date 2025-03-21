import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { Alert } from '../../../core/models/alert.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-alert-detail',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './alert-detail.component.html',
  styleUrl: './alert-detail.component.scss'
})

export class AlertDetailComponent implements OnInit {
  alert: Alert | null = null;
  loading = true;
  error = '';
  noteForm: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.noteForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAlert(id);
  }

  loadAlert(id: number): void {
    this.loading = true;
    this.alertService.getAlertById(id).subscribe(
      alert => {
        this.alert = alert;
        this.loading = false;
      },
      error => {
        this.error = 'Error loading alert details';
        this.loading = false;
        console.error('Error loading alert:', error);
      }
    );
  }

  updateStatus(status: string): void {
    if (!this.alert) return;
    
    this.alertService.updateAlertStatus(this.alert.id, status).subscribe(
      () => {
        if (this.alert) {
          this.alert.status = status;
        }
      },
      error => {
        console.error('Error updating alert status:', error);
      }
    );
  }

  addNote(): void {
    if (!this.alert || this.noteForm.invalid) return;
    
    const content = this.noteForm.value.content;
    this.alertService.addNote(this.alert.id, content).subscribe(
      () => {
        // Reload alert to get updated notes
        this.loadAlert(this.alert!.id);
        this.noteForm.reset();
      },
      error => {
        console.error('Error adding note:', error);
      }
    );
  }

  getSeverityClass(severity: string): string {
    if (!severity) return '';
    return severity.toLowerCase();
  }
  
}
