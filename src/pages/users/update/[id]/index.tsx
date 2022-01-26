import { useNavigate, useParams } from 'solid-app-router';
import { Component, createResource, Show } from 'solid-js';
import { useApplicationContext } from '../../../../context/context';
import AuthRepository from '../../../../repositories/AuthRepository';
import RoleRepository from '../../../../repositories/RoleRepository';
import UserRepository from '../../../../repositories/UserRepository';
import PrivateLayout from '../../../../templates/layout/PrivateLayout';
import UserUpdate from '../../../../templates/users/UserUpdate';

const IndexPage: Component = () =>
{

    const { id } = useParams<{ id: string ; }> ();
    const [ user ]: any = useApplicationContext();
    const authRepository = new AuthRepository( user() );
    const roleRepository = new RoleRepository( user() );
    const userRepository = new UserRepository( user() );

    const [ userSelected ] = createResource( userRepository.getOne ( id ) );
    const [ getRoles ] = createResource( roleRepository.getRoles() );
    const [ getPermissions ] = createResource( authRepository.getAllPermissions() );
    const navigate = useNavigate();
    const updateAction = async ( payload: any ) =>
    {
        const permissions = payload.permissions.map( ( permission: any ) => permission.value );
        const documentType = payload.documentType?.value;
        const country = payload.country?.value;
        const enable = payload.enable?.value;
        const rolesId = payload.roles.map( ( role: any ) => role.value );
        const data = { ...payload, country, documentType, enable, permissions };
        const update = userRepository.updateUser( id, data );
        const response = await update();
        // assign roles
        if ( payload.roles && payload.roles.length > 0 )
        {
            const { id } = response;
            const rolesRes = userRepository.assignUserRole( id, rolesId );
            const res = await rolesRes();
        }
        navigate( '/users', { replace : true } );

    };

    return <PrivateLayout>
        <Show when={!userSelected.loading} fallback={() => <p>Is Loading....</p>}>
            <UserUpdate
                updateAction={updateAction}
                userSelected={userSelected()}
                idSelected={id}
                permissionsList={getPermissions()}
                rolesList={getRoles()}
            />
        </Show>
    </PrivateLayout>;
};

export default IndexPage;
