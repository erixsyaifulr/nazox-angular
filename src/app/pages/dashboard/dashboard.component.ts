import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { latLng, tileLayer } from 'leaflet';

import { ChartType, Stat, Chat, Transaction } from './dashboard.model';

import {  revenueChart, salesAnalytics, sparklineEarning, sparklineMonthly, chatData, transactions } from './data';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 * Dashboard Component
 */
export class DashboardComponent implements OnInit {

  term: any;
  chatData: Chat[];
  transactions: Transaction[];
  statData: Stat[];

  employees: Employee[];
  token : any;
  userData:any;
  email:any;
  page :any = 1;
  limit : any = 5;
  skip:any;
  totalCount:any;
  first_name:any;
  selectedValue: any;
  searchValue: any = null;
  submitted = false;
  employee: Employee = new Employee();

  constructor(public formBuilder: FormBuilder,private employeeService: EmployeeService,
    private router: Router,private modalService: NgbModal) {
  }

  largeModal(largeDataModal: any) {
    this.submitted = false;
    this.employee = new Employee();
    this.modalService.open(largeDataModal, { size: 'lg' });
  }

  save() {
    this.employeeService.createEmployee(this.employee)
      .subscribe(data => console.log(data), error => console.log(error));
    this.employee = new Employee();
    // this.toastr.info('Berhasil menambahkan data...');
    // this.gotoList();
    this.modalService.dismissAll();
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Berhasil menambahkan data...',
      showConfirmButton: false,
      timer: 1500
    });
  }
 
  onSubmit() {
    this.submitted = true;
    this.save();
  }


  search($event){
    if(this.first_name == ""){
      this.ngOnInit();
    }else{
      if(this.page == 1){
        this.skip=0;
      }
      else{
        this.skip=(this.page - 1) * this.limit;
      }
  
      var requestObj = {
        'limit' : this.limit,
        'skip' : this.skip,
        'name' :this.searchValue
      }
  
      this.employeeService.getsearch(requestObj)
        .subscribe((response:any) => {
          this.employees = response.data;
          this.totalCount = response.totalRecord;
        });
    }
  }

  changelimit($event){
    this.selectedValue = $event.target.options[$event.target.options.selectedIndex].text;
    this.limit = this.selectedValue;
    this.reloadData();
  }

  reloadData(): void {
    if(this.page == 1){
      this.skip=0;
    }
    else{
      this.skip=(this.page - 1) * this.limit;
    }

    var requestObj = {
      'limit' : this.limit,
      'skip' : this.skip
    }

    // console.log(requestObj);

    this.employeeService.getEmployees(requestObj)
      .subscribe((response:any) => {
        this.employees = response.data;
        this.totalCount = response.totalRecord;
      });
  }

  employeeDetails(id: number) {
    this.router.navigate(['details', id]);
  }

  confirmBox(id: number){
    Swal.fire({
      title: 'Apakah anda yakin akan menghapus data ini ?',
      text: 'Kamu akan kehilangan data tersebut!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.employeeService.deleteEmployee(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
          Swal.fire(
            'Berhasil !',
            'Data tersebut berhasil dihapus.',
            'success'
          )
        },
        error => console.log(error));
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Data tersebut tidak jadi dihapus :)',
          'error'
        )
      }
    })
  }
 
  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }
 
  updateEmployee(id: number) {
    this.router.navigate(['update', id]);
  }


  // bread crumb items
  breadCrumbItems: Array<{}>;

  revenueChart: ChartType;
  salesAnalytics: ChartType;
  sparklineEarning: ChartType;
  sparklineMonthly: ChartType;

  // Form submit
  chatSubmit: boolean;

  formData: FormGroup;


  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 6,
    center: latLng(46.879966, -121.726909)
  };

  ngOnInit(): void {
    this.reloadData();
    this.breadCrumbItems = [{ label: 'Nazox' }, { label: 'Dashboard', active: true }];
    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });
    // this._fetchData();
  }

  private _fetchData() {
    this.revenueChart = revenueChart;
    this.salesAnalytics = salesAnalytics;
    this.sparklineEarning = sparklineEarning;
    this.sparklineMonthly = sparklineMonthly;
    this.chatData = chatData;
    this.transactions = transactions;
  }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  /**
   * Save the message in chat
   */
  messageSave() {
    const message = this.formData.get('message').value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.chatData.push({
        align: 'right',
        name: 'Ricky Clark',
        message,
        time: currentDate.getHours() + ':' + currentDate.getMinutes()
      });

      // Set Form Data Reset
      this.formData = this.formBuilder.group({
        message: null
      });
    }

    this.chatSubmit = true;
  }
}
