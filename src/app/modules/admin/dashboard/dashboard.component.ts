import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, OnDestroy, OnInit, AfterViewInit, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApexOptions } from 'ng-apexcharts';
import { AgmCoreModule, AgmMap, AgmDataLayer } from '@agm/core';
import { FuseLoadingBarService } from '@fuse/components/loading-bar';
import { SharedService, ReturnDataModel } from 'app/shared/shared.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';

import { environment } from 'environments/environment';
const backEndUrl = environment.apiUrl;

@Component({
    selector       : 'dashboard',
    templateUrl    : './dashboard.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit , OnDestroy
{
    user: User;
    visitorsChart: ApexOptions = {};
    reachabilityChart: ApexOptions = {};
    data: any;

    selectedComplaintId: number;
    mapLatitude: number = 0;
    mapLongitude: number = 0;
    mapZoom: number = 12;
    mapBounds: google.maps.LatLngBoundsLiteral | google.maps.LatLngBounds;


    geoJsonData: any;
    blockCodes: any = [];
    selectedFeature: any = {
        blockcode : '',
        totalvoters : '',
        malevoters : '',
        femalevoters : '',
        population : '',
        household : '',
        tehsil : '',
        district : ''
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _dashboardService: DashboardService,
                private http: HttpClient,
                public  _sharedService: SharedService,
                public  _userService: UserService,
                private _fuseLoadingBarService: FuseLoadingBarService,
                private _router: Router,
                private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void
    {
        this._fuseLoadingBarService.setAutoMode(false);

        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
                
                //this.http.get('http://localhost:4200/assets/files/pp_159.json').subscribe(data => {
                //    this.geoJsonData = data;
                //});

                //this._dashboardService.getBlobFile('https://svoogle.blob.core.windows.net/kmls/pp_159.json').subscribe((data) => {
                //    this.geoJsonData = data.json;
                //    this.calculateBoundsAndCenter();
                //});

                this._dashboardService.getConstituencyMapData().subscribe((data) => {
                    this.geoJsonData = data.data;
                    this.calculateBoundsAndCenter();
                });
        });

        // Get the data
        this.initData();
        
        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    }
                }
            }
        };
    }

    ngAfterViewInit (): void
    {
        this.fillData();        
        this.getRealtimeData();   
    }
    
    layerClick(event: any) {
        this.selectedFeature.blockcode = event.feature.getProperty('Block_Code');
        this.selectedFeature.tehsil = event.feature.getProperty('Tehsil_Name');
        this.selectedFeature.district = event.feature.getProperty('Distt_Name');
        this.selectedFeature.population = event.feature.getProperty('Population');
        this.selectedFeature.household = event.feature.getProperty('Household');
        this.selectedFeature.totalvoters = event.feature.getProperty('Total_Voters');
        this.selectedFeature.malevoters = event.feature.getProperty('Male_Voters');
        this.selectedFeature.femalevoters = event.feature.getProperty('Female_Voters');

        /*if (this.blockCodes.length > 0) {
            var blc = this.blockCodes.find(item => item.blc_code == this.selectedFeature.blockcode);
            if(blc != null){
                this.selectedFeature.totalvoters = blc.blc_votersCount;
                this.selectedFeature.malevoters = blc.blc_maleVotersCount;
                this.selectedFeature.femalevoters = blc.blc_femaleVotersCount;
            }
        }*/

        if (event.feature) {
            event.feature.setProperty('clicked', true);
        }

        this.geoJsonData = {
          ...this.geoJsonData,
          features: this.geoJsonData.features.map(f => {
            if (f.properties.Block_Code === this.selectedFeature.blockcode) {
              return {
                ...f,
                properties: {
                  ...f.properties,
                  clicked: true
                }
              }
            }
            else {
              return {
                ...f,
                properties: {
                  ...f.properties,
                  clicked: false
                }
              }
            }
          })
        };
    }

    styleFunc(feature: any) {
        if (feature.getProperty('clicked')) {
          return {
            fillColor: '#FF0000',
            fillOpacity: 0.5,
            strokeColor: '#FF0000',
            strokeWeight: 2
          }
        }
        else {
          return {
            fillColor: '#0000FF',
            fillOpacity: 0.3,
            strokeColor: '#0000FF',
            strokeWeight: 1
          }
        }
    }


    initData() {
        
        this.data = {
            stats : {
                //st_block_codes : '---',
                //st_polling_stations : '---',
                st_polling_agents : '---',
                st_app_users : '---',
                //st_total_voters : '---',
                //st_total_families : '---',
                //st_male_voters : '---',
                //st_female_voters : '---'
            },
            reachabilityStats : {
                overview: {
                    'voter-stats': {
                        'first_title' : 'Voters Reached',
                        'second_title': 'Families Reached',
                        'third_title' : 'Location Updates',
                        'first' : '---',
                        'second': '---',
                        'third' :  '---'
                    },
                    'nonvoter-stats': {
                        'first_title' : 'Total Requests',
                        'second_title': 'New CNIC Requests',
                        'third_title' : 'Vote Transfer Requests',
                        'first' :  '---',
                        'second':  '---',
                        'third' :  '---'
                    }
                },
                labels  : [],
                series  : {
                    'voter-stats': [
                        {
                            name: 'Voter Details Updated',
                            type: 'line',
                            data: []
                        },
                        {
                            name: 'Voter Locations Updated',
                            type: 'line',
                            data: []
                        }
                    ],                    
                    'nonvoter-stats': [
                        {
                            name: 'Total New/Tansfer Requests',
                            type: 'line',
                            data: []
                        },
                        {
                            name: 'New Vote Requests',
                            type: 'column',
                            data: []
                        },
                        {
                            name: 'Tansfer Vote Requests',
                            type: 'column',
                            data: []
                        }
                    ]
                }
            },           
            visitors : {
                series  : {
                    'today': [
                        {
                            name: 'Searches',
                            data: []
                        }
                    ],
                    'this-week': [
                        {
                            name: 'Searches',
                            data: []
                        }
                    ]
                }
            },
            complainDetails : {
                columns: ['report_time', 'type', 'complainent', 'mobile', 'status', 'actions'],
                rows   : []
            }
        };        

        this._prepareChartData();        
        this.cdRef.detectChanges();
    }

    fillData() {
        this._dashboardService.getData()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                if(data != this.data){
                    this.data = data;
                    
                    this.reachabilityChart.labels = this.data.reachabilityStats.labels;  
                    this.reachabilityChart.series = this.data.reachabilityStats.series;  
                    this.blockCodes = this.data.blockCodes;     
                    this.cdRef.detectChanges();
                }
            });
    }

    public getRealtimeData(): void {
        const source1 = new EventSource(backEndUrl + '/dashboard/data-dashboard-general-realtime/'+this.user.candidateid);
        source1.addEventListener('Dashboard_RealTimeGeneralData', e => {          
          const _data = JSON.parse(e["data"]);

          if(_data != null && _data.stats_st_polling_agents != null){
              this.data.stats.st_polling_agents = _data.stats_st_polling_agents;
              this.data.stats.st_app_users = _data.stats_st_app_users;
              this.data.reachabilityStats = _data.reachabilityStats; 
              this.reachabilityChart.series = this.data.reachabilityStats.series;  

              if(this.data.complainDetails.rows.length != _data.complainDetails.rows.length){
                this.data.complainDetails.rows = _data.complainDetails.rows;
              }

              this.cdRef.detectChanges();
          }
        });

        const source2 = new EventSource(backEndUrl + '/dashboard/data-dashboard-visiters-realtime/'+this.user.candidateid);
        source2.addEventListener('Dashboard_RealTimeVisitersData', e => {          
          const _data = JSON.parse(e["data"]);
           
          if(_data != null && _data.visitors != null){
              this.data.visitors = _data.visitors; 
              this.visitorsChart.series = this.data.visitors.series; 
              this.cdRef.detectChanges();

              /*if(this.data.visitors.series['today'][0].data.length == 0){
                this.data.visitors = _data.visitors; 

                this.visitorsChart.series = this.data.visitors.series; 
                this.cdRef.detectChanges();
              }
              else {
                this.data.visitors.series['today'][0].data = [{x: new Date('2023-03-10'), y: 300}].concat(this.data.visitors.series['today'][0].data.slice(0, -1));

                this.visitorsChart.series = this.data.visitors.series; 
                this.cdRef.detectChanges();
              }*/
          }
        });
    }      

    clickedMarker(id: number, index: number) {
        this.selectedComplaintId = id;
    }

    updateStatus(item: any, event) {
        const requestObject: any = {
            id: item.id,
            newstatus: item.status == 'unresolved' ? 'processing' : 'resolved'
        };

        try {
            this._dashboardService.updateComplaintStatus(requestObject)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if(res.type == "error") {
                    //this.showAlert('error', res.message);
                } else {
                    //this.showAlert('success', res.message);
                    item.status = requestObject.newstatus;
                    this.cdRef.detectChanges();
                }
            }, error => {
                //this.showAlert('error', 'Operation failed');
            });
        } catch (error) {
            //this.showAlert('error', 'Something went wrong. Please try again');
        }
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._fuseLoadingBarService.setAutoMode(true);
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    settings(): void
    {
        this._router.navigate(['/settings']);
    }

    calculateBoundsAndCenter() {
        const coordinates = this.extractCoordinates(this.geoJsonData.features);
        this.mapBounds = this.calculateBoundingBox(coordinates);
        const center = this.calculateCenter(coordinates);
        this.mapLatitude = center[1];
        this.mapLongitude = center[0];
    }

    extractCoordinates(features: any[]): number[][][] {
        // Implement logic to extract coordinates from GeoJSON features
        // Assuming Polygon features with coordinates in properties
        return features.map(feature => feature.geometry.coordinates[0]);
    }

    calculateBoundingBox(coordinates: number[][][]): google.maps.LatLngBoundsLiteral {
        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach(polygonCoordinates => {
          polygonCoordinates.forEach(coord => bounds.extend(new google.maps.LatLng(coord[1], coord[0])));
        });
        return bounds.toJSON();
    }

    calculateCenter(coordinates: number[][][]): number[] {
        const totalPoints = coordinates.reduce((acc, polygonCoordinates) => acc + polygonCoordinates.length, 0);
        const sumLat = coordinates.reduce((acc, polygonCoordinates) => {
          return acc + polygonCoordinates.reduce((sum, coord) => sum + coord[1], 0);
        }, 0);
        const sumLng = coordinates.reduce((acc, polygonCoordinates) => {
          return acc + polygonCoordinates.reduce((sum, coord) => sum + coord[0], 0);
        }, 0);

        const centerLat = sumLat / totalPoints;
        const centerLng = sumLng / totalPoints;

        return [centerLng, centerLat];
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void
    {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
             .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
             .forEach((el) => {
                 const attrVal = el.getAttribute('fill');
                 el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
             });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        this.visitorsChart = {
            chart     : {
                animations: {
                    speed           : 400,
                    animateGradually: {
                        enabled: false
                    }
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                width     : '100%',
                height    : '100%',
                type      : 'area',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            colors    : ['#818CF8'],
            dataLabels: {
                enabled: false
            },
            fill      : {
                colors: ['#312E81']
            },
            grid      : {
                show       : true,
                borderColor: '#334155',
                padding    : {
                    top   : 10,
                    bottom: -40,
                    left  : 0,
                    right : 0
                },
                position   : 'back',
                xaxis      : {
                    lines: {
                        show: true
                    }
                },
                yaxis      : {
                    lines: {
                        show: true
                    }
                }
            },
            series    : this.data.visitors.series,
            stroke    : {
                width: 2
            },
            tooltip   : {
                followCursor: true,
                theme       : 'dark',
                x           : {
                    format: 'MMM dd, yyyy hh:mm'
                },
                y           : {
                    formatter: (value: number): string => `${value}`
                }
            },
            xaxis     : {
                axisBorder: {
                    show: false
                },
                axisTicks : {
                    show: false
                },
                crosshairs: {
                    stroke: {
                        color    : '#475569',
                        dashArray: 0,
                        width    : 2
                    }
                },
                labels    : {
                    offsetY: -20,
                    style  : {
                        colors: '#CBD5E1'
                    }
                },
                //tickAmount: 20,
                tooltip   : {
                    enabled: false
                },
                type      : 'datetime'
            },
            yaxis     : {
                axisTicks : {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                //min       : (min): number => min - 750,
                //max       : (max): number => max + 250,
                //tickAmount: 5,
                show      : false
            }
        };

        this.reachabilityChart = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: true
                }
            },
            colors     : ['#3B9DC7', '#64748B', '#a882ab'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0
                }
            },
            grid       : {
                borderColor: 'var(--fuse-border)'
            },
            labels     : this.data.reachabilityStats.labels,
            legend     : {
                show: true
            },
            plotOptions: {
                bar: {
                    borderRadius: 0,
                    columnWidth: '10%'
                }
            },
            series     : this.data.reachabilityStats.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            stroke     : {
                width: [3, 3, 3]
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark'
            },
            xaxis      : {
                axisBorder: {
                    show: false
                },
                axisTicks : {
                    color: 'var(--fuse-border)'
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                tooltip   : {
                    enabled: false
                }
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    style  : {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };
    }
}
