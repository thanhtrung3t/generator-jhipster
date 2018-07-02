
<%#
 Copyright 2013-2018 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://www.jhipster.tech/
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
<%_
const query = generateEntityQueries(relationships, entityInstance, dto);
const queries = query.queries;
const variables = query.variables;

const hasRelationshipWithCompanys = query.hasRelationshipWithCompanys;
const isCompanyRelationships = query.isCompanyRelationships;
let hasManyToMany = query.hasManyToMany;
_%>
import { Component, OnInit<% if (fieldsContainImageBlob) { %>, ElementRef<% } %> } from '@angular/core';

import {Principal} from '../../shared/';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import {ITEMS_QUERY_ALL} from '../../shared/';
import {AlertService} from '../../shared/alert/alert-service';
import { Observable } from 'rxjs';
<%_ if ( fieldsContainInstant || fieldsContainZonedDateTime ) { _%>
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from '../../shared/constants/input.constants';
<%_ } _%>
<%_ if (queries && queries.length > 0 || fieldsContainBlob) { _%>
import { <% if (queries && queries.length > 0) { %>JhiAlertService, <% } %><% if (fieldsContainBlob) { %>JhiDataUtils<% } %> } from 'ng-jhipster';
<%_ } _%>

import { <%= entityAngularName %>Service } from './<%= entityFileName %>.service';

import { <%= entityAngularName %> } from './<%= entityFileName %>.model';
<%_
let hasRelationshipQuery = false;
Object.keys(differentRelationships).forEach(key => {
    const hasAnyRelationshipQuery = differentRelationships[key].some(rel =>
        (rel.relationshipType === 'one-to-one' && rel.ownerSide === true && rel.otherEntityName !== 'user')
        || rel.relationshipType !== 'one-to-many'
    );
    if (hasAnyRelationshipQuery) {
        hasRelationshipQuery = true;
    }
    if (differentRelationships[key].some(rel => rel.relationshipType !== 'one-to-many')) {
        const uniqueRel = differentRelationships[key][0];
        if (uniqueRel.otherEntityAngularName !== entityAngularName) {
            _%>
            import { <%= uniqueRel.otherEntityAngularName %>, <%= uniqueRel.otherEntityAngularName%>Service } from '../<%= uniqueRel.otherEntityModulePath %>';
            <%_     }
    }
}); _%>

@Component({
    selector: '<%= jhiPrefixDashed %>-<%= entityFileName %>-update',
    templateUrl: './<%= entityFileName %>-update.component.html'
})
export class <%= entityAngularName %>UpdateComponent implements OnInit {

    private _<%= entityInstance %>: <%= entityAngularName %>;
    isSaving: boolean;
    private currentAccount : any;
    <%_
    for ( const idx in variables ) {
        if(!isCompanyRelationships[idx]){
        %>
    <%- variables[idx] %>
    <%_ }} _%>
    <%_ for ( idx in fields ) {
        const fieldName = fields[idx].fieldName;
        const fieldType = fields[idx].fieldType;
        if ( fieldType === 'LocalDate' ) { _%>
        <%= fieldName %>Dp: any;
            <%_ } else if ( ['Instant', 'ZonedDateTime'].includes(fieldType) ) { _%>
        <%= fieldName %>: string;
            <%_ } _%>
        <%_ } _%>

    constructor(
        <%_ if (fieldsContainBlob) { _%>
        private dataUtils: JhiDataUtils,
        <%_ } _%>
        <%_ if (queries && queries.length > 0) { _%>
        private alertService: AlertService,
        <%_ } _%>
        private <%= entityInstance %>Service: <%= entityAngularName %>Service,
        private principal : Principal,
        <%_ Object.keys(differentRelationships).forEach(key => {
            if (differentRelationships[key].some(rel => rel.relationshipType !== 'one-to-many')) {
                const uniqueRel = differentRelationships[key][0];
                if (uniqueRel.otherEntityAngularName !== entityAngularName) { _%>
        private <%= uniqueRel.otherEntityName %>Service: <%= uniqueRel.otherEntityAngularName %>Service,
        <%_
                }
            }
        }); _%>
        <%_ if (fieldsContainImageBlob) { _%>
        private elementRef: ElementRef,
        <%_ } _%>
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.route.data.subscribe(({<%= entityInstance %>}) => {
            this.<%= entityInstance %> = <%= entityInstance %>;
        });
        this.principal.identity().then((account) => {
            this.currentAccount = account;
            <%_ for (idx in queries) {  if(!isCompanyRelationships[idx]&&hasRelationshipWithCompanys[idx]){_%>
            <%- queries[idx] %>
            <%_ }} _%>
        });
        <%_ for (idx in queries) {  if(!isCompanyRelationships[idx]&&!hasRelationshipWithCompanys[idx]){_%>
        <%- queries[idx] %>
        <%_ }} _%>

    }

    <%_ if (fieldsContainBlob) { _%>
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    <%_ if (fieldsContainImageBlob) { _%>
    clearInputImage(field: string, fieldContentType: string, idInput: string) {
        this.dataUtils.clearInputImage(this.<%= entityInstance %>, this.elementRef, field, fieldContentType, idInput);
    }

    <%_ } _%>
    <%_ } _%>
    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        <%_ for (idx in fields) {
            const fieldName = fields[ idx ].fieldName;
            const fieldType = fields[idx].fieldType;
            if ([ 'Instant', 'ZonedDateTime' ].includes(fieldType)) { _%>
                this.<%= entityInstance %>.<%= fieldName %> = moment(this.<%= fieldName %>, DATE_TIME_FORMAT);
        <%_ }
        } _%>
        if (this.<%= entityInstance %>.id !== undefined) {
            this.subscribeToSaveResponse(
                this.<%= entityInstance %>Service.update(this.<%= entityInstance %>));
        } else {
            <%_ if (hasRelationshipWithCompany) {_%>
            this.<%= entityInstance %>.companyId = this.currentAccount.companyId;
            <%_}_%>
            this.subscribeToSaveResponse(
                this.<%= entityInstance %>Service.create(this.<%= entityInstance %>));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<<%= entityAngularName %>>>) {
        result.subscribe((res: HttpResponse<<%= entityAngularName %>>) =>
            this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    <%_ if (queries && queries.length > 0) { _%>

    private onError(errorMessage: string) {
        this.alertService.error(errorMessage, null, null);
    }
    <%_ } _%>
    <%_
    const entitiesSeen = [];
    for (idx in relationships) {
        const otherEntityNameCapitalized = relationships[idx].otherEntityNameCapitalized;
        if (relationships[idx].relationshipType !== 'one-to-many' && !entitiesSeen.includes(otherEntityNameCapitalized)) {
    _%>

    track<%= otherEntityNameCapitalized %>ById(index: number, item: <%= relationships[idx].otherEntityAngularName %>) {
        return item.id;
    }
    <%_ entitiesSeen.push(otherEntityNameCapitalized); } } _%>
    <%_ if (hasManyToMany) { _%>

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
    <%_ } _%>
    get <%= entityInstance %>() {
        return this._<%= entityInstance %>;
    }

    set <%= entityInstance %>(<%= entityInstance %>: <%= entityAngularName %>) {
        this._<%= entityInstance %> = <%= entityInstance %>;
    <%_ for (idx in fields) {
        const fieldName = fields[idx].fieldName;
        const fieldType = fields[idx].fieldType;
        if (['Instant', 'ZonedDateTime'].includes(fieldType)) { _%>
        this.<%= fieldName %> = moment(<%= entityInstance %>.<%= fieldName %>).format(DATE_TIME_FORMAT);
     <%_ } } _%>
    }
}
