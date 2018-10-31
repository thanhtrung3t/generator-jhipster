<%#
Copyright 2013-2018 the original author or authors from the JHipster project.

    This file is part of the JHipster project, see http://www.jhipster.tech/
    for more information.

        Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
limitations under the License.

-%>
<%_ const keyPrefix = angularAppName + '.'+ entityTranslationKey; _%>
import { Component, OnInit,Input, OnDestroy,ViewChild } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import {AlertService} from '../../shared/alert/alert-service';
<%_ if (pagination === 'pagination' || pagination === 'pager') { _%>
    import { ActivatedRoute, Router } from '@angular/router';
    import {NgForm} from '@angular/forms';
    import {Page} from '../../shared/model/page.mode';
    <%_ } else if (searchEngine === 'elasticsearch') { _%>
    import { ActivatedRoute } from '@angular/router';
    <%_ } _%>
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, <% if (pagination !== 'no') { %>JhiParseLinks, <% } %>JhiAlertService<% if (fieldsContainBlob) { %>, JhiDataUtils<% } %> } from 'ng-jhipster';

import { <%= entityAngularName %> } from '../../shared/model/<%= entityFileName %>.model';
import { <%= entityAngularName %>DetailPopupService } from './<%= entityFileName %>-detail-popup.service';
import { <%= entityAngularName %>Service } from '../../shared/service/<%= entityFileName %>.service';
import { <%= entityAngularName %>DetailUpdateComponent} from './<%= entityFileName %>-detail-update.component';
import { <%= entityAngularName %>DetailDeleteDialogComponent } from './<%= entityFileName %>-detail-delete-dialog.component';


<%_
let parentRelationshipName ='';
for (idx in relationships) {
    const relationshipType = relationships[idx].relationshipType;
    const ownerSide = relationships[idx].ownerSide;
    const otherEntityName = relationships[idx].otherEntityName;
    const otherEntityNamePlural = relationships[idx].otherEntityNamePlural;
    const otherEntityNameCapitalized = relationships[idx].otherEntityNameCapitalized;
    const relationshipName = relationships[idx].relationshipName;
    const relationshipNameHumanized = relationships[idx].relationshipNameHumanized;
    const relationshipFieldName = relationships[idx].relationshipFieldName;
    const relationshipFieldNamePlural = relationships[idx].relationshipFieldNamePlural;
    const otherEntityField = relationships[idx].otherEntityField;
    const otherEntityFieldCapitalized = relationships[idx].otherEntityFieldCapitalized;
    const relationshipRequired = relationships[idx].relationshipRequired;
    if(relationshipType === 'many-to-one'  && relationshipName.endsWith('Parent'))
    { parentRelationshipName = relationshipName;  }
} _%>
<%_
let hasRelationshipQuery = false;
Object.keys(differentRelationships).forEach(key => {
    const uniqueRel = differentRelationships[key][0];
    if(!uniqueRel.relationshipName.endsWith('Parent')){
    _%>
    import { <%= uniqueRel.otherEntityAngularName %> } from '../../shared/model/<%= uniqueRel.otherEntityModulePath %>.model';
    import { <%= uniqueRel.otherEntityAngularName%>Service } from '../../shared/service/<%= uniqueRel.otherEntityModulePath %>.service';
    <%_}}); _%>


@Component({
    selector: '<%= jhiPrefixDashed %>-<%= entityFileName %>-detail-list',
    templateUrl: './<%= entityFileName %>-detail-list.component.html'
})
export class <%= entityAngularName %>DetailListComponent implements OnInit, OnDestroy {
    <%_ if (pagination === 'pagination' || pagination === 'pager') { _%>
    <%- include('pagination-template', {toArrayString: toArrayString}); -%>

    <%_ } else if (pagination === 'infinite-scroll') { _%>
    <%- include('infinite-scroll-template', {toArrayString: toArrayString}); -%>
    <%_ } else if (pagination === 'no') { _%>
    <%- include('no-pagination-template', {toArrayString: toArrayString}); -%>
    <%_ } _%>
    ngOnInit() {
        this.columns = [
            <%_ for (idx in fields) {
            const fieldName = fields[idx].fieldName;
            const fieldNameCapitalized = fields[idx].fieldNameCapitalized;
            const fieldNameHumanized = fields[idx].fieldNameHumanized;
            const fieldType = fields[idx].fieldType;
            _%>
            { name: '<%= keyPrefix %>.<%= fieldName %>', prop: '<%= fieldName %>' },
            <%_ } _%>
        <%_ for (idx in relationships) {
            const relationshipType = relationships[idx].relationshipType;
            const ownerSide = relationships[idx].ownerSide;
            const otherEntityName = relationships[idx].otherEntityName;
            const otherEntityNamePlural = relationships[idx].otherEntityNamePlural;
            const otherEntityNameCapitalized = relationships[idx].otherEntityNameCapitalized;
            const relationshipName = relationships[idx].relationshipName;
            const relationshipNameHumanized = relationships[idx].relationshipNameHumanized;
            const relationshipFieldName = relationships[idx].relationshipFieldName;
            const relationshipFieldNamePlural = relationships[idx].relationshipFieldNamePlural;
            const otherEntityField = relationships[idx].otherEntityField;
            const otherEntityFieldCapitalized = relationships[idx].otherEntityFieldCapitalized;
            const relationshipRequired = relationships[idx].relationshipRequired;
            const translationKey = `${keyPrefix}.${relationshipName}`; _%>
            <%_ if ((relationshipType === 'many-to-one' || (relationshipType === 'one-to-one' && ownerSide === true && otherEntityName === 'user'))&& otherEntityName !== 'company') { _%>

            { name: '<%= translationKey %>', prop: '<%=relationshipName %>DTO.name' },
            <%_ } _%>
            <%_ } _%>
        { name: '', prop: '',type:'action',canAutoResize:true }
    ];
        if(this.<%=parentRelationshipName%>Id){
            this.<%= entityInstance %>Service.query({"<%=parentRelationshipName%>Id.equals":this.<%=parentRelationshipName%>Id, size: 10000}).subscribe((res: HttpResponse<<%= entityAngularName %>[]>) => { this.<%= entityInstancePlural %> = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        }

        this.eventDeleteItemSubscriber = this.eventManager.subscribe('<%= entityFileName %>-detail-delete-item',()=>{
            if(this.<%=parentRelationshipName%>Id){
                this.<%= entityInstance %>Service.query({"<%=parentRelationshipName%>Id.equals":this.<%=parentRelationshipName%>Id, size: 10000}).subscribe((res: HttpResponse<<%= entityAngularName %>[]>) => { this.<%= entityInstancePlural %>  = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
            }
        });
        this.eventUpdateItemSubscriber = this.eventManager.subscribe('<%= entityFileName %>-detail.save.success',()=>{
            if(this.<%=parentRelationshipName%>Id){
                this.<%= entityInstance %>Service.query({"<%=parentRelationshipName%>Id.equals":this.<%=parentRelationshipName%>Id, size: 10000}).subscribe((res: HttpResponse<<%= entityAngularName %>[]>) => { this.<%= entityInstancePlural %> = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
            }
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventDeleteItemSubscriber);
        this.eventManager.destroy(this.eventUpdateItemSubscriber);
    }

    <%_ if (fieldsContainBlob) { _%>
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }
    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    <%_ } _%>

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

}
