<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController
{
    private $params;

    public function __construct(ParameterBagInterface $params)
    {
        $this->params = $params;
    }
    // ...

    #[Route('/logout', name: 'logout')]
    public function logout(AuthenticationUtils $authenticationUtils): Response
    {

        // Redirigez l'utilisateur vers la page de connexion ou une autre page si nécessaire
        return $this->redirectToRoute('app_default');
    }

// ...

    #[Route('/login', name: 'login')]
    public function login(Request $request): Response
    {
        if ($request->isMethod('POST')) {
            // Récupérer les données du formulaire
            $email = $request->request->get('email');
            $password = $request->request->get('password');

            // Charger les données existantes
            $filePath = $this->params->get('kernel.project_dir') . '/data/users.json';
            $data = json_decode(file_get_contents($filePath), true);

            // Vérifier les informations d'identification
            foreach ($data as $user) {
                if ($user['email'] === $email && password_verify($password, $user['password'])) {
                    // L'utilisateur est authentifié avec succès

                    // Créer une session
                    $session = $request->getSession();
                    $session->set('user', $user);

                    // Afficher un message de bienvenue avec l'e-mail de l'utilisateur
                    $welcomeMessage = 'Bonjour : ' . $user['email'];
                    print $welcomeMessage;
                    echo'<br>';

                    // Ajouter le bouton de déconnexion
                    $logoutButton = '<a href="/logout">Déconnexion</a>';
                    print $logoutButton;

                    // Assurez-vous de terminer la fonction après avoir effectué les actions nécessaires
                    return new Response();
                }
            }



            // Si les informations d'identification ne sont pas valides
            print "Email ou mot de passe incorrect";
        }


        // Gérer d'autres cas si nécessaire
        // ...

        // Assurez-vous de retourner une réponse à la fin de la fonction
        return $this->render('login/index.html.twig');

    }
}


