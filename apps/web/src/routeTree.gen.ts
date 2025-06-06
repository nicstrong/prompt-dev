/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AuthedImport } from './routes/_authed'
import { Route as AuthedIndexImport } from './routes/_authed.index'
import { Route as AuthedSettingsImport } from './routes/_authed.settings'
import { Route as AuthedThreadsThreadIdImport } from './routes/_authed.threads.$threadId'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthedRoute = AuthedImport.update({
  id: '/_authed',
  getParentRoute: () => rootRoute,
} as any)

const AuthedIndexRoute = AuthedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedSettingsRoute = AuthedSettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => AuthedRoute,
} as any)

const AuthedThreadsThreadIdRoute = AuthedThreadsThreadIdImport.update({
  id: '/threads/$threadId',
  path: '/threads/$threadId',
  getParentRoute: () => AuthedRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authed': {
      id: '/_authed'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthedImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_authed/settings': {
      id: '/_authed/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthedSettingsImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/': {
      id: '/_authed/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthedIndexImport
      parentRoute: typeof AuthedImport
    }
    '/_authed/threads/$threadId': {
      id: '/_authed/threads/$threadId'
      path: '/threads/$threadId'
      fullPath: '/threads/$threadId'
      preLoaderRoute: typeof AuthedThreadsThreadIdImport
      parentRoute: typeof AuthedImport
    }
  }
}

// Create and export the route tree

interface AuthedRouteChildren {
  AuthedSettingsRoute: typeof AuthedSettingsRoute
  AuthedIndexRoute: typeof AuthedIndexRoute
  AuthedThreadsThreadIdRoute: typeof AuthedThreadsThreadIdRoute
}

const AuthedRouteChildren: AuthedRouteChildren = {
  AuthedSettingsRoute: AuthedSettingsRoute,
  AuthedIndexRoute: AuthedIndexRoute,
  AuthedThreadsThreadIdRoute: AuthedThreadsThreadIdRoute,
}

const AuthedRouteWithChildren =
  AuthedRoute._addFileChildren(AuthedRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof AuthedRouteWithChildren
  '/login': typeof LoginRoute
  '/settings': typeof AuthedSettingsRoute
  '/': typeof AuthedIndexRoute
  '/threads/$threadId': typeof AuthedThreadsThreadIdRoute
}

export interface FileRoutesByTo {
  '/login': typeof LoginRoute
  '/settings': typeof AuthedSettingsRoute
  '/': typeof AuthedIndexRoute
  '/threads/$threadId': typeof AuthedThreadsThreadIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authed': typeof AuthedRouteWithChildren
  '/login': typeof LoginRoute
  '/_authed/settings': typeof AuthedSettingsRoute
  '/_authed/': typeof AuthedIndexRoute
  '/_authed/threads/$threadId': typeof AuthedThreadsThreadIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/login' | '/settings' | '/' | '/threads/$threadId'
  fileRoutesByTo: FileRoutesByTo
  to: '/login' | '/settings' | '/' | '/threads/$threadId'
  id:
    | '__root__'
    | '/_authed'
    | '/login'
    | '/_authed/settings'
    | '/_authed/'
    | '/_authed/threads/$threadId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthedRoute: typeof AuthedRouteWithChildren
  LoginRoute: typeof LoginRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthedRoute: AuthedRouteWithChildren,
  LoginRoute: LoginRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authed",
        "/login"
      ]
    },
    "/_authed": {
      "filePath": "_authed.tsx",
      "children": [
        "/_authed/settings",
        "/_authed/",
        "/_authed/threads/$threadId"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_authed/settings": {
      "filePath": "_authed.settings.tsx",
      "parent": "/_authed"
    },
    "/_authed/": {
      "filePath": "_authed.index.tsx",
      "parent": "/_authed"
    },
    "/_authed/threads/$threadId": {
      "filePath": "_authed.threads.$threadId.tsx",
      "parent": "/_authed"
    }
  }
}
ROUTE_MANIFEST_END */
