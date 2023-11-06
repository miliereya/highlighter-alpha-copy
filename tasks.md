# SPRINT 1

# 1. Setup CI

-   build
-   e2e tests
-   unit tests
-   lint

# 2. Register project to Amazon Web Services

-   Create account with project email
-   Setup project
-   Test production version
-   Setup CD

# 3. Add routes to highlight app

-   GET '/${\_id}'
-   GET '/' with params: title, by, sort, page, limit
-   DELETE '/${\_id}'

# 4. Add routes to user app

-   POST '/subscribe/${\_id}'
-   POST '/add-friend/${\_id}'
-   POST '/update'

# 5. Add and configure unit tests

-   Configure unit tests
-   Cover user.service.spec.ts
-   Cover auth.service.spec.ts

# TO DECIDE

-   Docker images of applications on different ports
-   Commit -> Gitlab -> Gitlab CI -> Google Cloud CD -> Production