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
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { <%= angularXAppName %>SharedModule } from '../../shared';
<%_ Object.keys(differentRelationships).forEach(key => {
    if (key === 'User') { _%>
        import { <%= angularXAppName %>AdminModule } from '../../admin/admin.module';
        <%_ }}); _%>
<%_
for (idx in relationships) {
    const relationshipType = relationships[idx].relationshipType;
    const ownerSide = relationships[idx].ownerSide;
    const otherEntityName = relationships[idx].otherEntityName;
    const otherEntityNamePlural = relationships[idx].otherEntityNamePlural;
    const otherEntityNameCapitalized = relationships[idx].otherEntityNameCapitalized;
    const relationshipName = relationships[idx].relationshipName;
    const relationshipNameHumanized = relationships[idx].relationshipNameHumanized;
    const relationshipFieldName = relationships[idx].relationshipFieldName;
    const otherEntityAngularFileName = relationships[idx].otherEntityAngularFileName;
    const relationshipFieldNamePlural = relationships[idx].relationshipFieldNamePlural;
    const otherEntityField = relationships[idx].otherEntityField;
    const otherEntityFieldCapitalized = relationships[idx].otherEntityFieldCapitalized;
    const relationshipRequired = relationships[idx].relationshipRequired;
    const otherEntityRelationshipName = relationships[idx].otherEntityRelationshipName;
    if(relationshipType === 'one-to-many'  && relationshipName.endsWith('DetailList') && otherEntityRelationshipName.endsWith('Parent')){ _%>
    import {<%= angularXAppName %><%=otherEntityNameCapitalized%>DetailModule} from '../<%=otherEntityAngularFileName%>-detail/<%=otherEntityAngularFileName%>-detail.module';
    <%_ }} _%>
import {
<%= entityAngularName %>Component,
    <%= entityAngularName %>DetailComponent,
    <%= entityAngularName %>UpdateComponent,
    <%= entityAngularName %>DeletePopupComponent,
    <%= entityAngularName %>DeleteDialogComponent,
    <%= entityInstance %>Route,
    <%= entityInstance %>PopupRoute,
    <%= entityAngularName %>PopupService
} from './';

const ENTITY_STATES = [
    ...<%= entityInstance %>Route,
    ...<%= entityInstance %>PopupRoute,
];

@NgModule({
    imports: [
        <%= angularXAppName %>SharedModule,
        <%_ Object.keys(differentRelationships).forEach(key => {
            if (key === 'User') { _%>
            <%= angularXAppName %>AdminModule,
            <%_ }}); _%>
<%_
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
    const otherEntityRelationshipName = relationships[idx].otherEntityRelationshipName;
    if(relationshipType === 'one-to-many'  && relationshipName.endsWith('DetailList') && otherEntityRelationshipName.endsWith('Parent')){_%>
    <%= angularXAppName %><%=otherEntityNameCapitalized%>DetailModule,
        <%_ }} _%>
RouterModule.forChild(ENTITY_STATES)
],
declarations: [
    <%= entityAngularName %>Component,
    <%= entityAngularName %>DetailComponent,
    <%= entityAngularName %>UpdateComponent,
    <%= entityAngularName %>DeleteDialogComponent,
    <%= entityAngularName %>DeletePopupComponent,
],
    entryComponents: [
    <%= entityAngularName %>Component,
    <%= entityAngularName %>UpdateComponent,
    <%= entityAngularName %>DeleteDialogComponent,
    <%= entityAngularName %>DeletePopupComponent,
],
providers: [
    <%= entityAngularName %>PopupService,
],

schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class <%= angularXAppName %><%= entityAngularName %>Module {}
