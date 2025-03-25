import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { Alert } from '../../../core/models/alert.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-alert-detail',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './alert-detail.component.html',
  styleUrl: './alert-detail.component.scss'
})

export class AlertDetailComponent implements OnInit {
  alertStatus: string = 'NEW';
  dropdownVisible: boolean = false;
  alert: Alert | null = null;
  today!: Date;
  loading = true;
  error = '';
  noteForm: FormGroup;
  noteInputVisible = false;

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
    this.today = new Date();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.loadAlert(id);
    } else {
      this.error = 'Invalid Alert ID';
      this.loading = false;
    }
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
  addNote(): void {
    if (!this.alert || this.noteForm.invalid) return;

    const content = this.noteForm.value.content;
    this.alertService.addNote(this.alert.id, content).subscribe(
      () => {
        this.loadAlert(this.alert!.id);
        this.noteForm.statusChanges.subscribe(status => {
          console.log('Form status:', status);
        });
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

  checkForm() {
    console.log(this.noteForm.value);
  }


  toggleNoteInput(): void {
    this.noteInputVisible = !this.noteInputVisible;
  }

}
