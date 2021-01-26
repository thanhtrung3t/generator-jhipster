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
package <%=packageName%>.service<% if (service === 'serviceImpl') { %>.impl<% } %>;
<%  const serviceClassName = service === 'serviceImpl' ? entityClass + 'ServiceImpl' : entityClass + 'Service';
    let viaService = false;
    const instanceType = (dto === 'mapstruct') ? entityClass + 'DTO' : entityClass;
    const instanceName = (dto === 'mapstruct') ? entityInstance + 'DTO' : entityInstance;
    const mapper = entityInstance  + 'Mapper';
    const dtoToEntity = mapper + '.'+ 'toEntity';
    const entityToDto = 'toDto';
    const entityToDtoReference = mapper + '::'+ 'toDto';
    const repository = entityInstance  + 'Repository';
    const searchRepository = entityInstance  + 'SearchRepository';
    if (service === 'serviceImpl') { %>
import <%=packageName%>.service.<%= entityClass %>Service;<% } %>
import <%=packageName%>.domain.<%= entityClass %>;


    import <%=packageName%>.repository.<%= entityClass %>Repository;<% if (searchEngine === 'elasticsearch') { %>
    import org.elasticsearch.search.sort.SortBuilders;
    import org.elasticsearch.search.sort.SortOrder;

    import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import <%=packageName%>.repository.search.<%= entityClass %>SearchRepository;<% } if (dto === 'mapstruct') { %>
import <%=packageName%>.service.dto.<%= entityClass %>DTO;
import <%=packageName%>.service.dto.<%= entityClass %>SearchDTO;
import org.springframework.data.domain.PageImpl;
<%_ for (idx in relationships) {
    const otherEntityRelationshipName = relationships[idx].otherEntityRelationshipName;
    const relationshipFieldName = relationships[idx].relationshipFieldName;
    const relationshipFieldNamePlural = relationships[idx].relationshipFieldNamePlural;
    const relationshipType = relationships[idx].relationshipType;

    const otherEntityName = relationships[idx].otherEntityName;
    const otherEntityNameCapitalized = relationships[idx].otherEntityNameCapitalized;
    const otherEntityFieldCapitalized = relationships[idx].otherEntityFieldCapitalized;
    const ownerSide = relationships[idx].ownerSide; _%>
<%_ if (relationshipType === 'many-to-one' || (relationshipType === 'one-to-one' && ownerSide === true)) { _%>
    import <%=packageName%>.domain.<%= otherEntityNameCapitalized %>;
<%_ } _%>
<%_ } _%>
import <%=packageName%>.service.mapper.<%= entityClass %>Mapper;<% } %>
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
    import java.util.stream.StreamSupport;

    import java.util.List;
    import java.util.stream.Collectors;
<%_ if (pagination !== 'no') { _%>
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
<%_ } _%>
import org.springframework.stereotype.Service;
<%_ if (databaseType === 'sql') { _%>
import org.springframework.transaction.annotation.Transactional;
<%_ } _%>
<% if (dto === 'mapstruct' && (pagination === 'no' ||  fieldsContainNoOwnerOneToOne === true)) { %>
import java.util.LinkedList;<% } %><% if (pagination === 'no' ||  fieldsContainNoOwnerOneToOne === true) { %><% } %><% if (databaseType === 'cassandra') { %>
import java.util.UUID;<% } %><% if (fieldsContainNoOwnerOneToOne === true || (pagination === 'no' && ((searchEngine === 'elasticsearch' && !viaService) || dto === 'mapstruct'))) { %>
import java.util.stream.Collectors;<% } %><% if (fieldsContainNoOwnerOneToOne === true || (pagination === 'no' && searchEngine === 'elasticsearch' && !viaService)) { %>
<% } %><% if (searchEngine === 'elasticsearch') { %>
<%_ for (idx in relationships) {
    const otherEntityRelationshipName = relationships[idx].otherEntityRelationshipName;
    const relationshipFieldName = relationships[idx].relationshipFieldName;
    const relationshipFieldNamePlural = relationships[idx].relationshipFieldNamePlural;
    const relationshipType = relationships[idx].relationshipType;

    const otherEntityName = relationships[idx].otherEntityName;
    const otherEntityNameCapitalized = relationships[idx].otherEntityNameCapitalized;
    const otherEntityFieldCapitalized = relationships[idx].otherEntityFieldCapitalized;
    const ownerSide = relationships[idx].ownerSide; _%>

<%_ if (relationshipType === 'many-to-one' || (relationshipType === 'one-to-one' && ownerSide === true)) { _%>
    import <%=packageName%>.repository.search.<%= otherEntityNameCapitalized %>SearchRepository;
    <%_ if (dto === 'mapstruct'){ _%>
    import <%=packageName%>.service.mapper.<%= otherEntityNameCapitalized %>Mapper;
<%_ } _%>
<%_ } _%>
<%_ } _%>
    import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.elasticsearch.index.query.QueryBuilders;
import static org.elasticsearch.index.query.QueryBuilders.*;<% } %>

/**
 * Service Implementation for managing <%= entityClass %>.
 */
@Service<% if (databaseType === 'sql') { %>
@Transactional<% } %>
public class <%= serviceClassName %><% if (service === 'serviceImpl') { %> implements <%= entityClass %>Service<% } %> {

    private final Logger log = LoggerFactory.getLogger(<%= serviceClassName %>.class);
<%- include('../../common/inject_template', {viaService: viaService, constructorName: serviceClassName, queryService: false}); -%>

    /**
     * Save a <%= entityInstance %>.
     *
     * @param <%= instanceName %> the entity to save
     * @return the persisted entity
     */
    <%_ if (service === 'serviceImpl') { _%>
    @Override
    <%_ } _%>
    public <%= instanceType %> save(<%= instanceType %> <%= instanceName %>) {
        log.debug("Request to save <%= entityClass %> : {}", <%= instanceName %>);<%- include('../../common/save_template', {viaService: viaService, returnDirectly: true}); -%>
    }

    /**
     * Get all the <%= entityInstancePlural %>.
     *<% if (pagination !== 'no') { %>
     * @param pageable the pagination information<% } %>
     * @return the list of entities
     */
    <%_ if (service === 'serviceImpl') { _%>
    @Override
    <%_ } _%>
    <%_ if (databaseType === 'sql') { _%>
    @Transactional(readOnly = true)
    <%_ } _%>
    public <% if (pagination !== 'no') { %>Page<<%= instanceType %><% } else { %>List<<%= instanceType %><% } %>> findAll(<% if (pagination !== 'no') { %>Pageable pageable<% } %>) {
        log.debug("Request to get all <%= entityClassPlural %>");
        <%_ if (pagination === 'no') { _%>
        return <%= entityInstance %>Repository.<% if (fieldsContainOwnerManyToMany === true) { %>findAllWithEagerRelationships<% } else { %>findAll<% } %>()<% if (dto === 'mapstruct') { %>.stream()
            .map(<%= entityToDtoReference %>)
            .collect(Collectors.toCollection(LinkedList::new))<% } %>;
        <%_ } else { _%>
        return <%= entityInstance %>Repository.findAll(pageable)<% if (dto !== 'mapstruct') { %>;<% } else { %>
            .map(<%= entityToDtoReference %>);<% } %>
        <%_ } _%>
    }
<%- include('../../common/get_filtered_template'); -%>
    /**
     * Get one <%= entityInstance %> by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    <%_ if (service === 'serviceImpl') { _%>
    @Override
    <%_ } _%>
    <%_ if (databaseType === 'sql') { _%>
    @Transactional(readOnly = true)
    <%_ } _%>
    public <%= instanceType %> findOne(<%= pkType %> id) {
        log.debug("Request to get <%= entityClass %> : {}", id);<%- include('../../common/get_template', {viaService: viaService, returnDirectly:true}); -%>
    }

    /**
     * Delete the <%= entityInstance %> by id.
     *
     * @param id the id of the entity
     */
    <%_ if (service === 'serviceImpl') { _%>
    @Override
    <%_ } _%>
    public void delete(<%= pkType %> id) {
        log.debug("Request to delete <%= entityClass %> : {}", id);<%- include('../../common/delete_template', {viaService: viaService}); -%>
    }




<%_ if (service === 'serviceImpl') { _%>
    @Override
    <%_ } _%>
    <%_ if (databaseType === 'sql') { _%>
    @Transactional(readOnly = true)
    <%_ } _%>
    public <% if (pagination !== 'no') { %>Page<<%= instanceType %><% } else { %>List<<%= instanceType %><% } %>> searchExample(<%= entityClass %>SearchDTO searchDto<% if (pagination !== 'no') { %>, Pageable pageable<% } %>) {
            NativeSearchQueryBuilder nativeSearchQueryBuilder = new NativeSearchQueryBuilder();
            BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
            <%_ for (idx in fields) {
                const fieldType = fields[idx].fieldType;
                const fieldTypeBlobContent = fields[idx].fieldTypeBlobContent;
                const fieldInJavaBeanMethod = fields[idx].fieldInJavaBeanMethod;
                const fieldName = fields[idx].fieldName; _%>
            <%_ if(fieldType === 'String') { _%>
            if(StringUtils.isNotBlank(searchDto.get<%=fieldInJavaBeanMethod%>())) {
                 boolQueryBuilder.must(QueryBuilders.wildcardQuery("<%=fieldName%>", "*"+searchDto.get<%=fieldInJavaBeanMethod%>()+"*"));
            }
            <%_ } else {_%>
                if(searchDto.get<%=fieldInJavaBeanMethod%>() !=null){
                boolQueryBuilder.must(QueryBuilders.matchQuery("<%=fieldName%>",searchDto.get<%=fieldInJavaBeanMethod%>()));
            }
            <%_ } _%>
            <%_ } _%>
            <%_ for (idx in relationships) {
                const otherEntityRelationshipName = relationships[idx].otherEntityRelationshipName;
                const relationshipFieldName = relationships[idx].relationshipFieldName;
                const relationshipFieldNamePlural = relationships[idx].relationshipFieldNamePlural;
                const relationshipType = relationships[idx].relationshipType;
                const relationshipNameCapitalized = relationships[idx].relationshipNameCapitalized;
                const otherEntityName = relationships[idx].otherEntityName;
                const otherEntityNameCapitalized = relationships[idx].otherEntityNameCapitalized;
                const otherEntityFieldCapitalized = relationships[idx].otherEntityFieldCapitalized;
                const ownerSide = relationships[idx].ownerSide; _%>
            <%_ if (relationshipType === 'many-to-one' || (relationshipType === 'one-to-one' && ownerSide === true)) { _%>
            if(searchDto.get<%=relationshipNameCapitalized%>Id() !=null) {
                boolQueryBuilder.must(QueryBuilders.matchQuery("<%=relationshipFieldName%>.id", searchDto.get<%=relationshipNameCapitalized%>Id()));
            }
            <%_ } _%>
            <%_ } _%>
            NativeSearchQueryBuilder queryBuilder = nativeSearchQueryBuilder.withQuery(boolQueryBuilder).withPageable(pageable);

            pageable.getSort().forEach(sort -> {
            queryBuilder.withSort(SortBuilders.fieldSort(sort.getProperty()).order(sort.getDirection() ==org.springframework.data.domain.Sort.Direction.ASC?SortOrder.ASC:SortOrder.DESC).unmappedType("long"));
            });
            NativeSearchQuery query = queryBuilder.build();
            Page<<%= entityClass %>> <%= entityInstance %>Page= <%= entityInstance %>SearchRepository.search(query);
            List<<%= instanceType %>> <%= entityInstance %>List =  StreamSupport
            .stream(<%= entityInstance %>Page.spliterator(), false)
            .map(<%= entityInstance %>Mapper::toDto)
            .collect(Collectors.toList());
            <%= entityInstance %>List.forEach(<%= entityInstance %>Dto -> {
            <%_ for (idx in relationships) {
                const otherEntityRelationshipName = relationships[idx].otherEntityRelationshipName;
                const relationshipFieldName = relationships[idx].relationshipFieldName;
                const relationshipFieldNamePlural = relationships[idx].relationshipFieldNamePlural;
                const relationshipType = relationships[idx].relationshipType;
                const relationshipNameCapitalized = relationships[idx].relationshipNameCapitalized;
                const otherEntityName = relationships[idx].otherEntityName;
                const otherEntityNameCapitalized = relationships[idx].otherEntityNameCapitalized;
                const otherEntityFieldCapitalized = relationships[idx].otherEntityFieldCapitalized;
                const ownerSide = relationships[idx].ownerSide; _%>
            <%_ if (relationshipType === 'many-to-one' || (relationshipType === 'one-to-one' && ownerSide === true)) { _%>
            if(<%= entityInstance %>Dto.get<%= relationshipNameCapitalized %>Id()!=null){
                <%=otherEntityNameCapitalized%> <%=otherEntityName%>= <%=otherEntityName%>SearchRepository.findOne(<%=entityInstance%>Dto.get<%=relationshipNameCapitalized%>Id());
                <%=entityInstance%>Dto.set<%=relationshipNameCapitalized%>DTO(<%=otherEntityName%>Mapper.toDto(<%=otherEntityName%>));
            }
            <%_ } _%>
            <%_ } _%>
            });
            return new PageImpl<>(<%= entityInstance %>List,pageable,<%= entityInstance %>Page.getTotalElements());
        }
}
