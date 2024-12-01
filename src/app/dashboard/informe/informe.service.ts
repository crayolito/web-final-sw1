import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Ticket {
  id: string;
  entrance: string; // Fecha y hora de entrada formateada
  exit: string; // Fecha y hora de salida formateada
  state: string; // available -> Pendiente, etc
  charge: number; // Cobro en BS
  extra: string; // Cobro extra en BS
  paymentMethod: string; // Método de pago
  clientName: string; // Nombre del cliente
}

@Injectable({
  providedIn: 'root',
})
export class InformeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getTickets(parkingId: string): Observable<Ticket[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/tickets/parking/${parkingId}`)
      .pipe(
        map((tickets) =>
          tickets.map((ticket) => ({
            id: ticket.id,
            entrance: this.formatDate(ticket.entrance),
            exit: ticket.exit ? this.formatDate(ticket.exit) : 'No registrado',
            state: this.mapState(ticket.state),
            charge: ticket.charge || 0,
            extra: ticket.extra || '0',
            paymentMethod: ticket.paymentMethod || 'Tarjeta de Crédito', // Valor por defecto
            clientName: ticket.idClient?.name || 'Cliente no registrado',
          }))
        )
      );
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} - ${date
      .toLocaleTimeString()
      .slice(0, 5)}`;
  }

  private mapState(state: string): string {
    switch (state?.toLowerCase()) {
      case 'available':
        return 'Pendiente';
      case 'paid':
        return 'Pagado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendiente';
    }
  }
}
