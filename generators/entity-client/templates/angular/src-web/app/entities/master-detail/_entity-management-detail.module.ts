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
import {
    <%= entityAngularName %>DetailUpdateComponent,
    <%= entityAngularName %>DetailPopupService,
    <%= entityAngularName %>DetailListComponent,
    <%= entityAngularName %>DetailDeleteDialogComponent
} from './';



@NgModule({
    imports: [
        <%= angularXAppName %>SharedModule,
        RouterModule,
        <%_ Object.keys(differentRelationships).forEach(key => {
            if (key === 'User') { _%>
            <%= angularXAppName %>AdminModule,
            <%_ }}); _%>

],
declarations: [
    <%= entityAngularName %>DetailUpdateComponent,
    <%= entityAngularName %>DetailListComponent,
    <%= entityAngularName %>DetailDeleteDialogComponent
],
entryComponents: [
    <%= entityAngularName %>DetailUpdateComponent,
    <%= entityAngularName %>DetailListComponent,
    <%= entityAngularName %>DetailDeleteDialogComponent
],
exports: [
    <%= entityAngularName %>DetailUpdateComponent,
    <%= entityAngularName %>DetailListComponent,
    <%= entityAngularName %>DetailDeleteDialogComponent
],
providers: [
    <%= entityAngularName %>DetailPopupService,
],

schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class <%= angularXAppName %><%= entityAngularName %>DetailModule {}
