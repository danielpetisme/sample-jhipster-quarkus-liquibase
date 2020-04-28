import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOperation } from 'app/shared/model/operation.model';
import { OperationService } from './operation.service';
import { OperationDeleteDialogComponent } from './operation-delete-dialog.component';

@Component({
  selector: 'jhi-operation',
  templateUrl: './operation.component.html'
})
export class OperationComponent implements OnInit, OnDestroy {
  operations?: IOperation[];
  eventSubscriber?: Subscription;

  constructor(protected operationService: OperationService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.operationService.query().subscribe((res: HttpResponse<IOperation[]>) => (this.operations = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInOperations();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IOperation): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInOperations(): void {
    this.eventSubscriber = this.eventManager.subscribe('operationListModification', () => this.loadAll());
  }

  delete(operation: IOperation): void {
    const modalRef = this.modalService.open(OperationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.operation = operation;
  }
}
