Rails.application.routes.draw do
  root    'static_pages#home'
  get     'static_pages/home'
  get     'static_pages/help'

  # for editor development
  get     'static_pages/loeditor'

  get     '/signup', to: 'users#new'
  post    '/signup', to: 'users#create'

  get     '/login',  to: 'sessions#new'
  post    '/login',  to: 'sessions#create'
  delete  '/logout', to: 'sessions#destroy'

  resources :users, param: :public_id do
    resources :posts
  end

  resources :account_activations, only: [:edit]
end
