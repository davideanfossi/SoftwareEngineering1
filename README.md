# softwareWeb

``` plantuml 
@startuml
class EZShop
Interface BalanceOperation
Interface Customer
Interface Order
Interface ProductType
Interface ReturnTransaction
Interface SaleTransaction
Interface TicketEntry
Interface User

EZShop --> DAOEZShop
EZShop --> BalanceOperation
EZShop --> Customer
EZShop --> ProductType
EZShop --> ReturnTransaction
EZShop --> SaleTransaction
EZShop --> TicketEntry
EZShop --> Order
EZShop --> User
@enduml          
```
