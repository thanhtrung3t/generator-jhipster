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
import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
<%_ if (pagination === 'pagination' || pagination === 'pager') { _%>
import { ActivatedRoute, Router } from '@angular/router';
import {NgForm} from '@angular/forms';

import {AlertService} from '../../shared/alert/alert-service';
import {ITEMS_QUERY_ALL} from '../../shared/';
<%_ } else if (searchEngine === 'elasticsearch') { _%>
import { ActivatedRoute } from '@angular/router';
<%_ } _%>
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, <% if (pagination !== 'no') { %>JhiParseLinks, <% } %>JhiAlertService<% if (fieldsContainBlob) { %>, JhiDataUtils<% } %> } from 'ng-jhipster';

import { <%= entityAngularName %> } from './<%= entityFileName %>.model';
import { <%= entityAngularName %>PopupService } from './<%= entityFileName %>-popup.service';
import { <%= entityAngularName %>Service } from './<%= entityFileName %>.service';
import { <%= entityAngularName %>DeleteDialogComponent } from './<%= entityFileName %>-delete-dialog.component';
import { <% if (pagination !== 'no') { %>ITEMS_PER_PAGE, <% } %>Principal } from '../../shared';
import {<%= entityAngularName %>Search} from './<%= entityFileName %>.search.model';
<%_
let hasRelationshipQuery = false;
Object.keys(differentRelationships).forEach(key => {
    const uniqueRel = differentRelationships[key][0];
    _%>
    import { <%= uniqueRel.otherEntityAngularName %>, <%= uniqueRel.otherEntityAngularName%>Service } from '../<%= uniqueRel.otherEntityModulePath %>';
<%_}); _%>


@Component({
    selector: '<%= jhiPrefixDashed %>-<%= entityFileName %>',
    templateUrl: './<%= entityFileName %>.component.html'
})
export class <%= entityAngularName %>Component implements OnInit, OnDestroy {
    <%_ if (pagination === 'pagination' || pagination === 'pager') { _%>
<%- include('pagination-template', {toArrayString: toArrayString}); -%>

    <%_ } else if (pagination === 'infinite-scroll') { _%>
<%- include('infinite-scroll-template', {toArrayString: toArrayString}); -%>
    <%_ } else if (pagination === 'no') { _%>
<%- include('no-pagination-template', {toArrayString: toArrayString}); -%>
    <%_ } _%>
    ngOnInit() {

        this.principal.identity().then((account) => {
            this.currentAccount = account;
            this.loadAll();
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
                const hasRelationshipWithCompany = relationships[idx].hasRelationshipWithCompany;
                if(((relationshipType === 'one-to-one'  && ownerSide === true) || relationshipType === 'many-to-one') && (hasRelationshipWithCompany)){
                    _%>
            this.<%= otherEntityName %>Service.query({"companyId.equals": this.currentAccount.companyId,"pageSize":ITEMS_QUERY_ALL }).subscribe(
                (res: HttpResponse<<%=otherEntityNameCapitalized%>[]>) => this.<%= otherEntityNamePlural %> = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
                <%_} } _%>
        });
        this.registerChangeIn<%= entityClassPlural %>();
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
            const otherEntityData = relationships[idx].otherEntityData;
            const hasRelationshipWithCompany = relationships[idx].hasRelationshipWithCompany;
                if(((relationshipType === 'one-to-one'  && ownerSide === true) || relationshipType === 'many-to-one')&&  (!hasRelationshipWithCompany && otherEntityName !== 'company')){
            _%>
        this.<%= otherEntityName %>Service.query().subscribe(
            (res: HttpResponse<<%=otherEntityNameCapitalized%>[]>) => this.<%= otherEntityNamePlural %> = res.body,
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        <%_} } _%>
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: <%= entityAngularName %>) {
        return item.id;
    }
    <%_ if (fieldsContainBlob) { _%>

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    <%_ } _%>
    <%_
    let eventCallBack = 'this.loadAll()';
    if (pagination === 'infinite-scroll') {
        eventCallBack = 'this.reset()';
    } _%>
    registerChangeIn<%= entityClassPlural %>() {
        this.eventSubscriber = this.eventManager.subscribe('<%= entityInstance %>ListModification', (response) => <%= eventCallBack %>);
    }

    <%_ if (pagination !== 'no') { _%>
        <%_ if (databaseType !== 'cassandra') { _%>
    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

        <%_ } _%>
        <%_ if (pagination === 'pagination' || pagination === 'pager') { _%>
    private onSuccess(data, headers) {
        <%_ if (databaseType !== 'cassandra') { _%>
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        <%_ } _%>
        this.<%= entityInstancePlural %> = data;
    }
        <%_ } else if (pagination === 'infinite-scroll') { _%>
    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        for (let i = 0; i < data.length; i++) {
            this.<%= entityInstancePlural %>.push(data[i]);
        }
    }

    <%_ }} _%>
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    public deleteItem(id:number){
        this.<%= entityInstance%>PopupService
            .open(<%= entityAngularName %>DeleteDialogComponent as Component, id);
    }
}
