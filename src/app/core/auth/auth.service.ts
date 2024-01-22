//import { user } from './../../mock-api/common/user/data';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';

import { environment } from '../../../environments/environment';
const backEndUrl = environment.apiUrl;

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for userId
     */
    set userId(userId: string)
    {
         localStorage.setItem('userId', userId);
    }

    get userId(): string
    {
         return localStorage.getItem('userId') ?? '';
    }

    /**
     * Setter & getter for userName
     */
     set userName(userName: string)
     {
          localStorage.setItem('userName', userName);
     }

     get userName(): string
     {
          return localStorage.getItem('userName') ?? '';
     }

    /**
     * Setter & getter for fullName
     */
    set fullName(fullName: string)
    {
         localStorage.setItem('fullName', fullName);
    }

    get fullName(): string
    {
         return localStorage.getItem('fullName') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param cnic
     * @param mobile
     */
     forgotPassword(cnic: string, mobile: string): Observable<any>
     {
         return this._httpClient.post(backEndUrl  + '/auth/forgot-password', {cnic, mobile});
     }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post(backEndUrl  + '/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { username: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(backEndUrl  + '/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {
                //console.log(response);

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                //set local vaiables
                this.userId = response.user.id;
                this.userName = response.user.username;
                this.fullName = response.user.name;


                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post(backEndUrl  + '/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>
                // Return false
                of(false)
            ),
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                //set local vaiables
                this.userId = response.user.id;
                this.userName = response.user.username;
                this.fullName = response.user.name;


                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { fullname: string; username: string; email: string; password: string; cnic: string }): Observable<any>
    {
        return this._httpClient.post(backEndUrl  + '/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { username: string; password: string }): Observable<any>
    {
        return this._httpClient.post(backEndUrl  + '/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
